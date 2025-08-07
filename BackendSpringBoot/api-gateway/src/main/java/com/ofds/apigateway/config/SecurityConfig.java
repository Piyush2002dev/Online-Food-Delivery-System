package com.ofds.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

	@Value("${jwt.secret}")
	private String jwtSecret;
	
	@Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withSecretKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))).build();
    }
	
	@Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http 
        		.csrf(csrf -> csrf.disable())
        		.authorizeExchange(exchanges -> exchanges
        		.pathMatchers(HttpMethod.OPTIONS,"/api/**").permitAll()
                .pathMatchers(HttpMethod.POST,"/api/auth/**").permitAll()
                .pathMatchers(HttpMethod.POST,"/api/customers/register").permitAll()
                .pathMatchers(HttpMethod.POST,"/api/restaurants/register").permitAll()
                .pathMatchers(HttpMethod.GET,"/api/menu/**").permitAll()
                .pathMatchers(HttpMethod.GET,"/api/orders/**").permitAll()
                .pathMatchers("/internal/**").denyAll()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwtSpec -> jwtSpec.jwtDecoder(jwtDecoder()))
            );
        return http.build();
    }
}
