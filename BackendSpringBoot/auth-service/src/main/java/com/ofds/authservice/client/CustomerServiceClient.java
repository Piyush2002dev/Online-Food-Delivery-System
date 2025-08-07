package com.ofds.authservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.ofds.authservice.dto.UserAuthDetailsDTO;

@FeignClient(name = "customer-service")
public interface CustomerServiceClient {

	@GetMapping("/internal/users/by-email/{email}")
    UserAuthDetailsDTO getUserByUsername(@PathVariable("email") String email);
	
}
