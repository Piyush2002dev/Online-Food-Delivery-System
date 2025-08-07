package com.delivery.delivery_service.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for transferring detailed delivery information.
 * Used when returning delivery data from the service layer to the controller/client.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDTO {
    private Long deliveryId;
    private Long orderId;
    private Long agentId;
    private String agentName;
    private String agentPhone;
    private String status;
    private LocalDateTime estimatedDeliveryTime;
}
