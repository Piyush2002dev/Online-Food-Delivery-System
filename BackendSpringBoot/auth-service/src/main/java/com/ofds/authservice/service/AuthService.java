package com.ofds.authservice.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ofds.authservice.client.CustomerServiceClient;
import com.ofds.authservice.client.RestaurantServiceClient;
import com.ofds.authservice.dto.LoginRequest;
import com.ofds.authservice.dto.LoginResponse;
import com.ofds.authservice.dto.UserAuthDetailsDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

	private final CustomerServiceClient customerServiceClient;
	private final RestaurantServiceClient restaurantServiceClient;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        log.info("Attempting to authenticate user: {}", loginRequest.getEmail());

        UserAuthDetailsDTO userDetails;
        try {
            userDetails = customerServiceClient.getUserByUsername(loginRequest.getEmail());
            log.debug("User details fetched for {}: {}", loginRequest.getEmail(), userDetails != null ? userDetails.getUsername() : "null");

            if (userDetails == null || userDetails.getHashedPassword() == null) {
                log.warn("User not found or password not set for: {}", loginRequest.getEmail());
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials");
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getHashedPassword())) {
                log.warn("Password mismatch for user: {}", loginRequest.getEmail());
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials");
            }

            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", userDetails.getId());
            claims.put("username", userDetails.getUsername());
            claims.put("email", userDetails.getEmail());
            claims.put("roles", userDetails.getRoles());

            String jwtToken = jwtService.generateToken(userDetails.getUsername(), claims);
            log.info("Authentication successful for user: {}", userDetails.getUsername());

            return new LoginResponse(jwtToken, "Login successful");

        } catch (feign.FeignException.NotFound e) {
            log.warn("User {} not found in Customer Service during authentication.", loginRequest.getEmail());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials", e);
        } catch (Exception e) {
            log.error("Authentication failed for {}: {}", loginRequest.getEmail(), e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Authentication failed unexpectedly", e);
        }
    }
    
    public LoginResponse authenticateRestaurant(LoginRequest loginRequest) {
        log.info("Attempting to authenticate user: {}", loginRequest.getEmail());

        UserAuthDetailsDTO userDetails;
        try {
          
            userDetails = restaurantServiceClient.getUserByUsername(loginRequest.getEmail());
            log.debug("User details fetched for {}: {}", loginRequest.getEmail(), userDetails != null ? userDetails.getUsername() : "null");

            if (userDetails == null || userDetails.getHashedPassword() == null) {
                log.warn("User not found or password not set for: {}", loginRequest.getEmail());
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials");
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getHashedPassword())) {
                log.warn("Password mismatch for user: {}", loginRequest.getEmail());
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials");
            }

            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", userDetails.getId());
            claims.put("username", userDetails.getUsername());
            claims.put("email", userDetails.getEmail());
            claims.put("roles", userDetails.getRoles());

            String jwtToken = jwtService.generateToken(userDetails.getUsername(), claims);
            log.info("Authentication successful for user: {}", userDetails.getUsername());

            return new LoginResponse(jwtToken, "Login successful");

        } catch (feign.FeignException.NotFound e) {
            log.warn("User {} not found in Customer Service during authentication.", loginRequest.getEmail());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials", e);
        } catch (Exception e) {
            log.error("Authentication failed for {}: {}", loginRequest.getEmail(), e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Authentication failed unexpectedly", e);
        }
    }
}
