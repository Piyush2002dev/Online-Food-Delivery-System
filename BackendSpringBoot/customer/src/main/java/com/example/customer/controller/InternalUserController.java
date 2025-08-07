package com.example.customer.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.customer.dto.UserAuthDetailsDTO;
import com.example.customer.service.CustomerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
@Slf4j
public class InternalUserController {

	private final CustomerService customerService;
	
	@GetMapping("/by-email/{email}")
    public ResponseEntity<UserAuthDetailsDTO> getUserByUsername(@PathVariable String email) {
        log.info("Received internal request to fetch user details for: {}", email);

        Optional<UserAuthDetailsDTO> userAuthDetailsDTO = customerService.findUserAuthDetailsByIdentifier(email);

        if (userAuthDetailsDTO.isPresent()) {
            return ResponseEntity.ok(userAuthDetailsDTO.get());
        } else {
            log.warn("Internal user lookup failed for: {}", email);
            return ResponseEntity.notFound().build();
        }
    }
	
}
