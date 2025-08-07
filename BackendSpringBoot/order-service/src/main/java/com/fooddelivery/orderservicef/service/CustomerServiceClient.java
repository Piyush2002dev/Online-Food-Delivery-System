package com.fooddelivery.orderservicef.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.fooddelivery.orderservicef.dto.CustomerProfileDTO;

@FeignClient(name = "customer-service", fallback = CustomerServiceClientFallback.class)
public interface CustomerServiceClient {

    @GetMapping("/api/customers/user")
    CustomerProfileDTO getCustomerProfile(
        @RequestHeader("X-Internal-User-Id") String customerId,
        @RequestHeader("X-Internal-User-Roles") String roles
    );
} 