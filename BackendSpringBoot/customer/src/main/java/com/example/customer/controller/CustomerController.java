package com.example.customer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;

import com.example.customer.dto.AuthResponseDTO;
import com.example.customer.dto.CustomerProfileDTO;
import com.example.customer.dto.CustomerRegisterDTO;
import com.example.customer.dto.CustomerUpdateDTO;
import com.example.customer.exception.CustomerNotFoundException;
import com.example.customer.service.CustomerService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/*
 * Controller for handling customer-related operations.
 * Provides REST API endpoints for customer registration, login, profile retrieval, and profile updates.
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {


    private final CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody CustomerRegisterDTO dto, HttpServletRequest request) {
    	System.out.print("REISTRATION IS HIT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+request.getRequestURI());
        AuthResponseDTO response = customerService.register(dto);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/user")
    public ResponseEntity<CustomerProfileDTO> getProfile(@RequestHeader("X-Internal-User-Id") String requestId,
    													@RequestHeader("X-Internal-User-Roles")String roles) throws CustomerNotFoundException {
   

        if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(customerService.getCustomerProfile(Long.valueOf(requestId)));
    }

    @PutMapping("/user")
    public ResponseEntity<CustomerUpdateDTO> updateProfile(
            @RequestBody CustomerUpdateDTO dto,
            @RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) throws CustomerNotFoundException {
    	
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(customerService.updateCustomer(Long.valueOf(requestId), dto));
    }
}