package com.delivery.delivery_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AgentResponseDTO {
    private Long agentId;
    private String agentName;
    private String agentPhoneNumber;
    private Long deliveryId; // optional
}
