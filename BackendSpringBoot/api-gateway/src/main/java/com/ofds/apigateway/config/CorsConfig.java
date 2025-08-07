package com.ofds.apigateway.config;


import java.util.Arrays;

import java.util.Collections;
 
import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.reactive.CorsWebFilter;

import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
 
@Configuration

public class CorsConfig {
 
    @Bean

    public CorsWebFilter corsWebFilter() {

        CorsConfiguration corsConfig = new CorsConfiguration();

        // **IMPORTANT**: Replace with your actual frontend origin(s)

//        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:4200","http://localhost:5173"));
        corsConfig.setAllowedOriginPatterns(Arrays.asList("http://localhost:4200","http://localhost:5173"));

        corsConfig.setMaxAge(3600L);

        corsConfig.addAllowedMethod("*"); // Allow all methods (GET, POST, PUT, DELETE, OPTIONS, etc.)

        corsConfig.addAllowedHeader("*"); // Allow all headers

        corsConfig.setAllowCredentials(true); // Needed if sending Authorization headers, cookies, etc.
 
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", corsConfig); // Apply this CORS config to all paths

        return new CorsWebFilter(source);

    }

}
 