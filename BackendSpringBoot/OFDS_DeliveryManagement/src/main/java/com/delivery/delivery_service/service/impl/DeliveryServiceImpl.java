package com.delivery.delivery_service.service.impl;

import com.delivery.delivery_service.client.OrderClient;
import com.delivery.delivery_service.dto.DeliveryAssignmentDTO;
import com.delivery.delivery_service.dto.DeliveryDTO;
import com.delivery.delivery_service.dto.DeliveryStatusUpdateDTO;
import com.delivery.delivery_service.dto.OrderDTO;
import com.delivery.delivery_service.entity.AgentEntity;
import com.delivery.delivery_service.entity.AgentStatus;
import com.delivery.delivery_service.entity.DeliveryEntity;
import com.delivery.delivery_service.entity.DeliveryStatus;
import com.delivery.delivery_service.exception.*;
import com.delivery.delivery_service.repository.AgentRepository;
import com.delivery.delivery_service.repository.DeliveryRepository;
import com.delivery.delivery_service.service.DeliveryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;


/**
 * Service implementation for managing delivery operations.
 * This class handles the core business logic for delivery assignments,
 * status updates, and retrieval of delivery information.
 * It interacts with {@link AgentRepository} and {@link DeliveryRepository}
 * for data persistence and {@link OrderClient} for external order validation.
 */

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private static final Logger logger = LoggerFactory.getLogger(DeliveryServiceImpl.class);

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderClient orderClient;


    /**
     * Assigns a delivery agent to a specific order.
     * This method performs several validations, including checking for valid order and agent IDs,
     * preventing duplicate assignments for an order, and ensuring the agent is not already assigned.
     * Upon successful assignment, it updates the agent's status and creates a new delivery record.
     *
     * @param dto The {@link DeliveryAssignmentDTO} containing the order ID and agent ID.
     * @return A {@link DeliveryDTO} representing the newly assigned delivery.
     * @throws IllegalArgumentException If the order ID or agent ID is invalid.
     * @throws DuplicateAssignmentException If a delivery already exists for the order or the agent is already assigned.
     * @throws ResourceNotFoundException If the agent specified by the agent ID is not found.
     */

    @Override
    @Transactional
    public DeliveryDTO assignDeliveryAgent(DeliveryAssignmentDTO dto) {
        logger.info("Assigning delivery agent. Order ID: {}, Agent ID: {}", dto.getOrderId(), dto.getAgentId());

        // Validate incoming order ID.
        if (!isValidOrderId(dto.getOrderId())) {
            logger.error("Invalid Order ID: {}", dto.getOrderId());
            throw new InvalidOrderIdException("Invalid Order ID: " + dto.getOrderId());
        }

        // Validate incoming agent ID.
        if (!isValidAgentId(dto.getAgentId())) {
            logger.error("Invalid Agent ID: {}", dto.getAgentId());
            throw new InvalidAgentIdException("Invalid Agent ID: " + dto.getAgentId());
        }

        // Check if a delivery record already exists for the given order to prevent duplicates.
        if (deliveryRepository.existsByOrderId(dto.getOrderId())) {
            logger.error("Delivery already exists for Order ID: {}", dto.getOrderId());
            throw new DuplicateAssignmentException("Delivery already exists for this order.");
        }

        // Retrieve the agent by ID, throwing an exception if not found.
        AgentEntity agent = agentRepository.findById(dto.getAgentId())
                .orElseThrow(() -> {
                    logger.error("Agent not found with ID: {}", dto.getAgentId());
                    return new ResourceNotFoundException("Agent not found");
                });

        // Check if the agent is already assigned to another delivery.
        if (agent.getAgentStatus() == AgentStatus.ASSIGNED) {
            logger.warn("Agent ID {} is already assigned", dto.getAgentId());
            throw new DuplicateAssignmentException("Agent is already assigned to another delivery");
        }

        // Update agent status to ASSIGNED and save.
        agent.setAgentStatus(AgentStatus.ASSIGNED);
        agentRepository.save(agent);
        logger.debug("Agent ID {} status set to ASSIGNED", agent.getAgentId());

        // Build and save the new delivery entity.
        DeliveryEntity delivery = DeliveryEntity.builder()
                .agent(agent)
                .orderId(dto.getOrderId())
                .deliveryStatus(DeliveryStatus.IN_PROGRESS)
                .estimatedTimeOfArrival(LocalDateTime.now().plusMinutes(30)) // Default ETA
                .build();

        delivery = deliveryRepository.save(delivery);
        logger.info("Delivery assigned successfully. Delivery ID: {}", delivery.getDeliveryId());

        // Map the created entity to a DTO and return.
        return mapToDTO(delivery);
    }

    // Order Validation
    private boolean isValidOrderId(Long orderId) {
        // Example validation: orderId must be non-null, positive, and within a reasonable range.
        return orderId != null && orderId > 0 && orderId <= 10000;
        // return orderClient.isOrderValid(orderId);   is fully integrated
    }

    // Agent Id Validation
    private boolean isValidAgentId(Long agentId) {
        // Example validation: agentId must be non-null, positive, and within a reasonable range.
        return agentId != null && agentId > 0 && agentId <= 1000;
    }


    /**
     * Updates the status of an existing delivery.
     * This method retrieves the delivery, validates the new status,
     * and updates the agent's status if the delivery is marked as DELIVERED.
     *
     * @param deliveryId The ID of the delivery to update.
     * @param dto        The {@link DeliveryStatusUpdateDTO} containing the new status and estimated delivery time.
     * @return A {@link DeliveryDTO} representing the updated delivery.
     * @throws ResourceNotFoundException If the delivery specified by the delivery ID is not found.
     * @throws InvalidStatusException    If the provided status string is not a valid {@link DeliveryStatus}.
     */
    @Override
    @Transactional
    public DeliveryDTO updateDeliveryStatus(
            Long deliveryId, DeliveryStatusUpdateDTO dto) {
        logger.info("Updating delivery status. Delivery ID: {}, New Status: {}",
                deliveryId, dto.getStatus());
        DeliveryEntity delivery =
                deliveryRepository.findById(deliveryId).orElseThrow(() -> {
                    logger.error("Delivery not found with ID: {}", deliveryId);
                    return new ResourceNotFoundException("Delivery not found");
                });
        DeliveryStatus newStatus;
        String statusStr = (String) dto.getStatus();
        if (statusStr == null) {
            logger.error("Status value is null");
            throw new InvalidStatusException("Status must not be null.");
        }
        //newStatus = DeliveryStatus.valueOf(statusStr.toUpperCase());
        try {
            //newStatus = DeliveryStatus.valueOf(dto.getStatus().toUpperCase());
            //newStatus = DeliveryStatus.valueOf(((String) dto.getStatus()).toUpperCase());
            newStatus = DeliveryStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid status value: {}", dto.getStatus());
            String validStatuses = Arrays.stream(DeliveryStatus.values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new InvalidStatusException("Invalid status: " + dto.getStatus()
                    + ". Valid statuses are " + validStatuses + ".");
        }
        if (newStatus == DeliveryStatus.DELIVERED) {
            AgentEntity agent = delivery.getAgent();
            agent.setAgentStatus(AgentStatus.AVAILABLE);
            agentRepository.save(agent);
            logger.debug("Agent ID {} status set to AVAILABLE", agent.getAgentId());
        }
        delivery.setDeliveryStatus(newStatus);
        delivery.setEstimatedTimeOfArrival(dto.getEstimatedDeliveryTime());
        delivery = deliveryRepository.save(delivery);
        logger.info("Delivery status updated successfully. Delivery ID: {}, "
                        + "Status: {}",
                deliveryId, newStatus.name());
        return mapToDTO(delivery);
    }
//    @Override
//    @Transactional
//    public DeliveryDTO updateDeliveryStatus(Long deliveryId, DeliveryStatusUpdateDTO dto) {
//        logger.info("Updating delivery status. Delivery ID: {}, New Status: {}", deliveryId, dto.getStatus());
//
//        // Find the delivery by ID, throw exception if not found
//        DeliveryEntity delivery = deliveryRepository.findById(deliveryId)
//                .orElseThrow(() -> {
//                    logger.error("Delivery not found with ID: {}", deliveryId);
//                    return new ResourceNotFoundException("Delivery not found");
//                });
//
//        DeliveryStatus newStatus = (DeliveryStatus) dto.getStatus();
//
//        if (newStatus == null) {
//            logger.error("Null status provided");
//            throw new InvalidStatusException("Status value cannot be null.");
//        }
//
//        // If status is DELIVERED, make agent available
//        if (newStatus == DeliveryStatus.DELIVERED) {
//            AgentEntity agent = delivery.getAgent();
//            if (agent != null) {
//                agent.setAgentStatus(AgentStatus.AVAILABLE);
//                agentRepository.save(agent);
//                logger.debug("Agent ID {} status set to AVAILABLE", agent.getAgentId());
//            }
//        }
//
//        // Update and save delivery
//        delivery.setDeliveryStatus(newStatus);
//        delivery.setEstimatedTimeOfArrival(dto.getEstimatedDeliveryTime());
//        delivery = deliveryRepository.save(delivery);
//
//        logger.info("Delivery status updated successfully. Delivery ID: {}, Status: {}", deliveryId, newStatus.name());
//        return mapToDTO(delivery);
//    }



    /**
     * Retrieves delivery information by the associated order ID.
     *
     * @param orderId The ID of the order for which to retrieve delivery information.
     * @return A {@link DeliveryDTO} representing the delivery for the given order.
     * @throws ResourceNotFoundException If no delivery is found for the specified order ID.
     */
    @Override
    @Transactional
    public DeliveryDTO getDeliveryByOrderId(Long orderId) {
        logger.info("Fetching delivery for Order ID: {}", orderId);

        // Find the delivery by order ID, throwing an exception if not found.
        DeliveryEntity delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> {
                    logger.error("Delivery not found for Order ID: {}", orderId);
                    return new ResourceNotFoundException("Delivery not found for order ID: " + orderId);
                });

        logger.debug("Delivery found. Delivery ID: {}", delivery.getDeliveryId());

        // Map the found entity to a DTO and return.
        return mapToDTO(delivery);
    }


    /**
     * Helper method to convert a {@link DeliveryEntity} to a {@link DeliveryDTO}.
     * This separates the mapping logic from the main service methods.
     *
     * @param entity The {@link DeliveryEntity} to convert.
     * @return A {@link DeliveryDTO} representing the entity's data.
     */
    private DeliveryDTO mapToDTO(DeliveryEntity entity) {
        return DeliveryDTO.builder()
                .deliveryId(entity.getDeliveryId())
                .agentId(entity.getAgent().getAgentId())
                .agentName(entity.getAgent().getAgentName())
                .agentPhone(entity.getAgent().getAgentPhoneNumber())
                .orderId(entity.getOrderId())
                .status(entity.getDeliveryStatus().name()) // Convert enum to string for DTO.
                .estimatedDeliveryTime(entity.getEstimatedTimeOfArrival())
                .build();
    }


    @Override
    @Transactional
    public DeliveryDTO assignDelivery(OrderDTO dto) {
        logger.info("Assigning delivery agent. Order ID: {}", dto.getOrderId());

        if (!isValidOrderId(dto.getOrderId())) {
            logger.error("Invalid Order ID: {}", dto.getOrderId());
            throw new InvalidOrderIdException("Invalid Order ID: " + dto.getOrderId());
        }

        if (deliveryRepository.existsByOrderId(dto.getOrderId())) {
            logger.error("Delivery already exists for Order ID: {}", dto.getOrderId());
            throw new DuplicateAssignmentException("Delivery already exists for this order.");
        }

        Long availableAgentId = findAvailableAgent();
        if (availableAgentId == null) {
            logger.warn("No available delivery agents at the moment.");
            throw new ResourceNotFoundException("No available delivery agents.");
        }

        AgentEntity agent = agentRepository.findById(availableAgentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + availableAgentId));

        agent.setAgentStatus(AgentStatus.ASSIGNED);
        agentRepository.save(agent);
        logger.debug("Agent ID {} status set to ASSIGNED", agent.getAgentId());

        DeliveryEntity delivery = DeliveryEntity.builder()
                .agent(agent)
                .orderId(dto.getOrderId())
                .deliveryStatus(DeliveryStatus.IN_PROGRESS)
                .estimatedTimeOfArrival(LocalDateTime.now().plusMinutes(30)) // default ETA
                .build();

        delivery = deliveryRepository.save(delivery);
        logger.info("Delivery assigned successfully. Delivery ID: {}", delivery.getDeliveryId());

        return mapToDTO(delivery);
    }

    @Override
    public Long findAvailableAgent() {
        return agentRepository.findByAgentStatus(AgentStatus.AVAILABLE)
                .stream()
                .findAny() // You can use findFirst() or implement random logic if needed
                .map(AgentEntity::getAgentId)
                .orElse(null);
    }

}