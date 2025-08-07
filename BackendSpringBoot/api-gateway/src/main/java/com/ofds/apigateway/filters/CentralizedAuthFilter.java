package com.ofds.apigateway.filters;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class CentralizedAuthFilter extends AbstractGatewayFilterFactory<CentralizedAuthFilter.Config> {

    public CentralizedAuthFilter() {
        super(Config.class);
    }

    public static class Config {
        private String requiredRole;
        private boolean matchUserIdToPathId;

        public String getRequiredRole() {
            return requiredRole;
        }

        public void setRequiredRole(String requiredRole) {
            this.requiredRole = requiredRole;
        }

        public boolean isMatchUserIdToPathId() {
            return matchUserIdToPathId;
        }

        public void setMatchUserIdToPathId(boolean matchUserIdToPathId) {
            this.matchUserIdToPathId = matchUserIdToPathId;
        }
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            return exchange.getPrincipal()
                    .filter(principal -> principal instanceof JwtAuthenticationToken)
                    .cast(JwtAuthenticationToken.class)
                    .flatMap(jwtAuth -> {
                        Map<String, Object> claims = jwtAuth.getToken().getClaims();

                        // --- 1. Role Check ---
                        if (config.getRequiredRole() != null && !config.getRequiredRole().isEmpty()) {
                            Object rolesClaim = claims.get("roles");
                            boolean hasRequiredRole = false;

                            if (rolesClaim instanceof String) {
                                hasRequiredRole = List.of(((String) rolesClaim).split(","))
                                        .stream()
                                        .anyMatch(role -> role.trim().equalsIgnoreCase(config.getRequiredRole()));
                            } else if (rolesClaim instanceof List) {
                                hasRequiredRole = ((List<?>) rolesClaim).stream()
                                        .map(Object::toString)
                                        .anyMatch(role -> role.trim().equalsIgnoreCase(config.getRequiredRole()));
                            }

                            if (!hasRequiredRole) {
                                return denyAccess(exchange, "Access Denied: Missing required role.");
                            }
                        }

                        // --- 2. User ID to Path ID Matching ---
                        if (config.isMatchUserIdToPathId()) {
                            Pattern pattern = Pattern.compile("/api/[^/]+/(\\d+)");
                            Matcher matcher = pattern.matcher(exchange.getRequest().getURI().getPath());

                            Long pathId = null;
                            if (matcher.find()) {
                                try {
                                    pathId = Long.parseLong(matcher.group(1));
                                } catch (NumberFormatException e) {
                                    return denyAccess(exchange, "Access Denied: Invalid path ID format.");
                                }
                            }

                            Object userIdClaim = claims.get("userId");
                            if (userIdClaim == null || pathId == null || !Long.valueOf(String.valueOf(userIdClaim)).equals(pathId)) {
                                return denyAccess(exchange, "Access Denied: User ID mismatch.");
                            }
                        }

                        // --- 3. Authorization Successful: Mutate Request Headers ---
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-Internal-User-Id", String.valueOf(claims.get("userId")))
                                .header("X-Internal-User-Name", (String) claims.getOrDefault("username", claims.get("sub")))
                                .header("X-Internal-User-Roles", String.valueOf(claims.get("roles")))
                                // ✅ Authorization header is preserved
                                .build();

                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    })
                    .switchIfEmpty(chain.filter(exchange));
        };
    }

    private Mono<Void> denyAccess(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.FORBIDDEN);
        return response.setComplete();
    }

    @Override
    public List<String> shortcutFieldOrder() {
        return List.of("requiredRole", "matchUserIdToPathId");
    }
}
