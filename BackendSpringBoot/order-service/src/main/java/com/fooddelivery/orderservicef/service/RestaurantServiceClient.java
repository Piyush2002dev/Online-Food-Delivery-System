package com.fooddelivery.orderservicef.service;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.fooddelivery.orderservicef.dto.RestaurantDTO;

@FeignClient(name = "restaurant-service",url = "${service.restaurant.base-url}")
public interface RestaurantServiceClient {
    @GetMapping("/api/restaurants/{restaurantId}")
    RestaurantDTO getRestaurantById(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long restaurantId);
}