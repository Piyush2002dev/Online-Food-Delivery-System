package com.delivery.delivery_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;


@Configuration

@EnableWebSecurity

public class SecurityConfig {

    @Bean

    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                .anyRequest().permitAll()

            );

        return http.build();

    }

}
 
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
//public class SecurityConfig {
//
//    /**
//     * Configures the security filter chain that processes all HTTP requests.
//     * This method defines access control rules based on URL paths and HTTP basic authentication.
//     *
//     * @param http The {@link HttpSecurity} object to configure security settings.
//     * @return A {@link SecurityFilterChain} bean that Spring Security will use.
//     * @throws Exception If an error occurs during HttpSecurity configuration.
//     */
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                // Configure authorization rules for incoming HTTP requests.
//                .authorizeHttpRequests(authorize -> authorize
//                        // Allow unauthenticated access to Swagger UI and OpenAPI documentation endpoints.
//                        // These are public endpoints for API exploration.
//                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
//                        // Restrict access to the delivery assignment endpoint: only users with the 'ADMIN' role are allowed.
//                        .requestMatchers("/api/delivery/assign").hasRole("ADMIN")
//                        // All other incoming requests must be authenticated.
//                        .anyRequest().authenticated()
//                )
//                // Enable HTTP Basic authentication. This provides a simple username/password authentication mechanism
//                // for clients, typically used for machine-to-machine communication or quick testing.
//                .httpBasic(Customizer.withDefaults())
//                // Disable CSRF (Cross-Site Request Forgery) protection.
//                // For stateless REST APIs, CSRF tokens are often not necessary as there are no sessions to protect.
//                // In production, if session-based authentication were used or CSRF tokens were handled on the client-side,
//                // this should be re-enabled and properly configured.
//                .csrf(csrf -> csrf.disable());
//
//        return http.build(); // Build the configured SecurityFilterChain.
//    }
//
//    /**
//     * Configures an in-memory user details service.
//     * This is suitable for development and testing environments, providing predefined users.
//     *
//     * @return An {@link InMemoryUserDetailsManager} containing the user details.
//     * NOTE: In a production environment, this should be replaced by a
//     * robust {@link org.springframework.security.core.userdetails.UserDetailsService}
//     * implementation that fetches user data from a secure database, LDAP, or an identity provider.
//     */
//    @Bean
//    public UserDetailsService userDetailsService() {
//        // Get the password encoder bean to securely encode user passwords.
//        PasswordEncoder encoder = passwordEncoder();
//
//        // Define an Admin user with username "admin" and the "ADMIN" role.
//        UserDetails admin = User.withUsername("admin")
//                .password(encoder.encode("admin123")) // Password "admin123" is encoded
//                .roles("ADMIN") // Grants the ADMIN role
//                .build();
//
//        // Define a Regular user with username "user" and the "USER" role.
//        UserDetails user = User.withUsername("user")
//                .password(encoder.encode("user123")) // Password "user123" is encoded
//                .roles("USER") // Grants the USER role
//                .build();
//
//        // Define a Delivery Agent user with username "agent" and the "DELIVERY_AGENT" role.
//        // This user would typically be used by an actual delivery agent client to update statuses.
//        UserDetails deliveryAgent = User.withUsername("agent")
//                .password(encoder.encode("agent123")) // Password "agent123" is encoded
//                .roles("DELIVERY_AGENT") // Grants the DELIVERY_AGENT role
//                .build();
//
//        // Return an in-memory user details manager, registering all the defined users.
//        return new InMemoryUserDetailsManager(admin, user, deliveryAgent);
//    }
//
//    /**
//     * Provides a BCrypt password encoder bean.
//     * BCrypt is a strong, adaptive password hashing function designed to resist brute-force attacks.
//     * It's highly recommended for securely storing user passwords.
//     *
//     * @return A {@link BCryptPasswordEncoder} instance.
//     */
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//}