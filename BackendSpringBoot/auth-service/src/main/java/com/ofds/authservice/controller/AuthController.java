package com.ofds.authservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofds.authservice.dto.LoginRequest;
import com.ofds.authservice.dto.LoginResponse;
import com.ofds.authservice.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

	private final AuthService authenticationService;
    
	@PostMapping("/customer/login")
    public ResponseEntity<LoginResponse> customerlogin(@RequestBody LoginRequest loginRequest) {
        log.info("Received login request for username/email: {}", loginRequest.getEmail());
        LoginResponse response = authenticationService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
	
	@PostMapping("/restaurant/login")
    public ResponseEntity<LoginResponse> restaurantlogin(@RequestBody LoginRequest loginRequest) {
        log.info("Received login request for username/email: {}", loginRequest.getEmail());
        LoginResponse response = authenticationService.authenticateRestaurant(loginRequest);
        return ResponseEntity.ok(response);
    }
}
