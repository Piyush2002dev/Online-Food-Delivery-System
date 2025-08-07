package com.delivery.delivery_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "order-service")
public interface OrderClient {
    /**
     * Checks if an order with the given ID exists and is valid in the Order Service.
     * This method is typically used to validate whether an order can be assigned for delivery.
     *
     * @param orderId The unique identifier of the order.
     * It's recommended that the Order Service's implementation of this endpoint
     * also considers the order's status (e.g., not cancelled, not already delivered)
     * to determine validity for delivery assignment.
     */
    @GetMapping("/api/orders/{orderId}/exists")
    boolean isOrderValid(@PathVariable("orderId") Long orderId);
}
