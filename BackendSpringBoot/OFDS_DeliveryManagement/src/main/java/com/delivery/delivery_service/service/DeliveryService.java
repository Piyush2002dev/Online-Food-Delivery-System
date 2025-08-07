package com.delivery.delivery_service.service;

import com.delivery.delivery_service.dto.DeliveryAssignmentDTO;
import com.delivery.delivery_service.dto.DeliveryDTO;
import com.delivery.delivery_service.dto.DeliveryStatusUpdateDTO;
import com.delivery.delivery_service.dto.OrderDTO;

/**
 * Interface defining the business logic for managing delivery operations.
 * This contract specifies the core functionalities of the Delivery Service.
 */
public interface DeliveryService {

    /*
     * Assigns a delivery agent to a specific order.
     *
     * @param dto Contains the order ID and the agent ID for the assignment.
     * @return A {@link DeliveryDTO} representing the newly created delivery record.
     * @throws IllegalArgumentException If orderId or agentId are invalid.
     * @throws DuplicateAssignmentException If the order is already assigned or the agent is already assigned.
     * @throws ResourceNotFoundException If the agent specified by agentId is not found.
     */
    DeliveryDTO assignDeliveryAgent(DeliveryAssignmentDTO dto);

    /*
     * Updates the status of an existing delivery.
     *
     * @param deliveryId The unique ID of the delivery to update.
     * @param dto Contains the new status and optionally an updated estimated delivery time.
     * @return A {@link DeliveryDTO} representing the updated delivery record.
     * @throws ResourceNotFoundException If the delivery specified by deliveryId is not found.
     * @throws InvalidStatusException If the provided status value is invalid or leads to an invalid transition.
     */
    DeliveryDTO updateDeliveryStatus(Long deliveryId, DeliveryStatusUpdateDTO dto);

    /*
     * Retrieves the delivery details for a given order ID.
     *
     * @param orderId The unique ID of the order to find the delivery for.
     * @return A {@link DeliveryDTO} representing the delivery associated with the order.
     * @throws ResourceNotFoundException If no delivery record is found for the given order ID.
     */
    DeliveryDTO getDeliveryByOrderId(Long orderId);

    Long findAvailableAgent();

    DeliveryDTO assignDelivery(OrderDTO orderDTO);
}

