package com.delivery.delivery_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
public class AuditingConfig implements AuditorAware<String> {

    /**
     * Retrieves the username of the currently authenticated user to be used for auditing.
     * This method is automatically called by Spring Data JPA when an entity with
     * `@CreatedBy` or `@LastModifiedBy` annotations is saved or updated.
     *
     * @return An {@link Optional} containing the username of the authenticated user.
     * Returns {@code Optional.empty()} if no user is authenticated,
     * or if the authentication principal's name is null or empty,
     * in which case it defaults to "anonymous".
     */

    @Override
    public Optional<String> getCurrentAuditor() {
        // This method provides the username of the current authenticated user
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated) // Ensure it's an authenticated user
                .map(Authentication::getName) // Get the username (principal name)
                .map(name -> name.isEmpty() ? "anonymous" : name);
    }
}
