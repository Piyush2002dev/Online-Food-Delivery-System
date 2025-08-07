package com.fooddelivery.orderservicef.dto;

import java.util.UUID;

import com.fooddelivery.orderservicef.model.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateDTO {
    private Long orderId;
    private OrderStatus status;
    private Long restaurantId; // For validation
}