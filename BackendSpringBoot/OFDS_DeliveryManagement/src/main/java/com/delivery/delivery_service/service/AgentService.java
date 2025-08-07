package com.delivery.delivery_service.service;

import com.delivery.delivery_service.dto.AgentCreateDTO;
import com.delivery.delivery_service.dto.AgentResponseDTO;

public interface AgentService {
    Long findAvailableAgent();
    AgentCreateDTO createAgent(AgentCreateDTO agentCreateDTO);
}
