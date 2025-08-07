package com.delivery.delivery_service.repository;

import com.delivery.delivery_service.entity.AgentEntity;
import com.delivery.delivery_service.entity.AgentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link AgentEntity}.
 * Provides standard CRUD operations and custom query methods for agent data.
 */
public interface AgentRepository extends JpaRepository<AgentEntity, Long> {
    /**
     * Finds all agents that have a specific status.
     * This allows querying for agents that are, for example, 'AVAILABLE' or 'ASSIGNED'.
     *
     * @param status The {@link AgentStatus} to filter agents by.
     * @return A list of {@link AgentEntity} matching the given status.
     */
    List<AgentEntity> findByAgentStatus(AgentStatus status);

}
