package com.delivery.delivery_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AgentCreateDTO {
    private String agentName;
    private String agentPhoneNumber;
    private String agentStatus; // "AVAILABLE"
}
