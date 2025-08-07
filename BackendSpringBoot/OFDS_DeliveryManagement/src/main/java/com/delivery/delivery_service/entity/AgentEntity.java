package com.delivery.delivery_service.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a delivery agent in the system.
 * This entity maps to the 'agent' table in the database.
 */

@Entity
@Table(name = "agent")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "agent_id", nullable = false)
    private Long agentId;

    @Column(name = "agent_name", nullable = false)
    private String agentName;

    /**
     * The current status of the agent (e.g., AVAILABLE, ASSIGNED).
     * Stored as a string in the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "agent_status", nullable = false)
    private AgentStatus agentStatus;

    @Column(name = "phone_number", nullable = false, length = 10)
    private String agentPhoneNumber;
}