package com.delivery.delivery_service.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for updating the status of an existing delivery.
 * Used when an external system or UI requests a change in delivery status.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeliveryStatusUpdateDTO {
    private String status;
    private LocalDateTime estimatedDeliveryTime;
}
