package com.fooddelivery.orderservicef.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fooddelivery.orderservicef.model.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long orderId;
    private Long userId;
    private Long restaurantId;
    private OrderStatus status;
    private double totalAmount;
    private LocalDateTime orderTime;
    private LocalDateTime deliveryTime;
    private String deliveryAddress;
    private List<OrderItemDTO> items;
    private Long paymentId;
    private  Long deliveryAgentId;
    private String idempotencyKey;
    private Long deliveryId; 
    
    // Customer information fields
    private String customerName;
    private String customerPhone;
}