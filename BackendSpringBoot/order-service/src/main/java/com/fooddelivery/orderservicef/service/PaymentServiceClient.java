package com.fooddelivery.orderservicef.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.fooddelivery.orderservicef.config.PaymentRetryConfig;
import com.fooddelivery.orderservicef.dto.PaymentRequestDTO;
import com.fooddelivery.orderservicef.dto.PaymentResponseDTO;

@FeignClient(
    name = "PAYMENT-MODULE",
    configuration = PaymentRetryConfig.class 
)
public interface PaymentServiceClient {
    @PostMapping("/api/payments/initiate")
    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
    PaymentResponseDTO processPayment(
        @RequestBody PaymentRequestDTO request
    );
}