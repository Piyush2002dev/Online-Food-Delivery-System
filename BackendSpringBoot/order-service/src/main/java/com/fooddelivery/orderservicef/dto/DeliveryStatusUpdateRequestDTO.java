package com.fooddelivery.orderservicef.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for requesting an update to the delivery status in the Delivery Service.
 * This mirrors the DeliveryStatusUpdateDTO from the delivery-service.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryStatusUpdateRequestDTO {
    private DeliveryStatus status;
    private LocalDateTime estimatedDeliveryTime; // Optional: can be null if not updating ETA
}
