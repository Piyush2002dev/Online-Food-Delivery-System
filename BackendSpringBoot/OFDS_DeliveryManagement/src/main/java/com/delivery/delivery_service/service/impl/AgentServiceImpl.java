package com.delivery.delivery_service.service.impl;

import com.delivery.delivery_service.dto.AgentCreateDTO;
import com.delivery.delivery_service.dto.AgentResponseDTO;
import com.delivery.delivery_service.entity.AgentEntity;
import com.delivery.delivery_service.entity.AgentStatus;
import com.delivery.delivery_service.repository.AgentRepository;
import com.delivery.delivery_service.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;

    @Override
    public Long findAvailableAgent() {
        return agentRepository.findByAgentStatus(AgentStatus.AVAILABLE)
                .stream()
                .findAny()
                .map(AgentEntity::getAgentId)
                .orElse(null);
    }

    @Override
    public AgentCreateDTO createAgent(AgentCreateDTO dto) {
        AgentEntity agent = AgentEntity.builder()
                .agentName(dto.getAgentName())
                .agentPhoneNumber(dto.getAgentPhoneNumber())
                .agentStatus(AgentStatus.valueOf(dto.getAgentStatus()))
                .build();

        AgentEntity saved = agentRepository.save(agent);

        return AgentCreateDTO.builder()
                .agentName(saved.getAgentName())
                .agentPhoneNumber(saved.getAgentPhoneNumber())
                .build();
    }
}
