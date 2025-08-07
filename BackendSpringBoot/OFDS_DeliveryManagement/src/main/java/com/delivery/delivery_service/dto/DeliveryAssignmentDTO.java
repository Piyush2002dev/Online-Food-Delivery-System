package com.delivery.delivery_service.dto;

import lombok.*;

import java.util.UUID;

/**
 * DTO for requesting the assignment of a delivery agent to an order.
 * Used when an external system or UI initiates a new delivery assignment.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeliveryAssignmentDTO {
    private Long orderId;
    private Long restaurantId;
    private String deliveryAddress;
    private Long agentId;

}
