package com.delivery.delivery_service.entity;

/**
 * Defines the possible operational statuses for a delivery agent.
 */

public enum AgentStatus {
    /**
     * Agent is ready to take new delivery assignments.
     */
    AVAILABLE,
    /**
     * Agent is currently occupied with a delivery assignment.
     */
    ASSIGNED
}
