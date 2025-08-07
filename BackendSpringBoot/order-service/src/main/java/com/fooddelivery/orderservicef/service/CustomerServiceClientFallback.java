package com.fooddelivery.orderservicef.service;

import org.springframework.stereotype.Component;

import com.fooddelivery.orderservicef.dto.CustomerProfileDTO;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CustomerServiceClientFallback implements CustomerServiceClient {

    @Override
    public CustomerProfileDTO getCustomerProfile(String customerId, String roles) {
        log.warn("Customer service is unavailable, returning fallback data for customer ID: {}", customerId);
        
        // Return a fallback CustomerProfileDTO with basic information
        CustomerProfileDTO fallback = new CustomerProfileDTO();
        fallback.setId(Long.valueOf(customerId));
        fallback.setName("Customer #" + customerId);
        fallback.setPhone(null);
        fallback.setAddress(null);
        fallback.setEmail(null);
        
        return fallback;
    }
} 