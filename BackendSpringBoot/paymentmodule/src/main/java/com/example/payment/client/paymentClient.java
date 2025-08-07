package com.example.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="order-service")
public interface paymentClient {
	
@GetMapping("/api/payments/order/{orderId}")
boolean isOrderValid(@PathVariable("orderId") Long orderId);

}