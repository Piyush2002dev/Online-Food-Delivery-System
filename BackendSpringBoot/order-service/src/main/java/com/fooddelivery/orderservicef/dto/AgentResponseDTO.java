package com.fooddelivery.orderservicef.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AgentResponseDTO {
    private Long deliveryId;
    private Long orderId;
    private Long agentId;
    private String agentName;
    private String agentPhone;
    private String status;
    private LocalDateTime estimatedDeliveryTime;

}
