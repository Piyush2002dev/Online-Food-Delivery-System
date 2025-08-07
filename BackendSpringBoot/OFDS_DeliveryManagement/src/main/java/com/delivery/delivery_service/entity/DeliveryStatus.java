package com.delivery.delivery_service.entity;

/**
 * Defines the possible states a delivery can be in during its lifecycle.
 */
public enum DeliveryStatus {
    /**
     * The delivery is currently in progress, from assignment to completion.
     */
    IN_PROGRESS,
    /**
     * The delivery has been successfully completed.
     */
    DELIVERED
}
