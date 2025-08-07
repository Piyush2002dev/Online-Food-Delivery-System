package com.delivery.delivery_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delivery.delivery_service.dto.AgentCreateDTO;
import com.delivery.delivery_service.dto.DeliveryAssignmentDTO;
import com.delivery.delivery_service.dto.DeliveryDTO;
import com.delivery.delivery_service.dto.DeliveryStatusUpdateDTO;
import com.delivery.delivery_service.service.AgentService;
import com.delivery.delivery_service.service.DeliveryService;
import com.delivery.delivery_service.dto.OrderDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST controller for managing delivery operations.
 * This class exposes a set of RESTful APIs to assign delivery agents,
 * update delivery statuses, and retrieve delivery information.
 * It integrates with Spring Security for role-based access control
 * and uses Swagger/OpenAPI annotations for API documentation.
 */
@RestController
@RequestMapping("/api/delivery")
@Tag(name = "Delivery Service", description = "API's for managing deliveries and agents")
public class DeliveryController {

    private static final Logger logger = LoggerFactory.getLogger(DeliveryController.class);

    @Autowired
    private DeliveryService deliveryService;
    
    @Autowired
    private AgentService agentService;


    /**
     * Assigns a delivery agent to an order.
     * This endpoint requires the authenticated user to have the 'ADMIN' role.
     * It handles the assignment process, including validations and status updates for the agent and delivery.
     *
     * @param  {@link DeliveryAssignmentDTO} containing the order ID and agent ID for the assignment.
     * @return A {@link ResponseEntity} containing the {@link DeliveryDTO} of the newly assigned delivery
     * and an HTTP status of 200 OK.
     * @throws IllegalArgumentException If the provided order ID or agent ID is invalid.
     * @throws com.delivery.delivery_service.exception.DuplicateAssignmentException If a delivery already exists for the order,
     * or the agent is already assigned to another delivery.
     * @throws com.delivery.delivery_service.exception.ResourceNotFoundException If the specified agent is not found.
     */
//    @PostMapping("/assign")
//    @PreAuthorize("hasRole('ADMIN')")
//    @Operation(summary = "Assign Agent to Order", description = "Assigns a delivery agent to a specific order. Requires 'ADMIN' role.")
//    public ResponseEntity<DeliveryDTO> assignDelivery(@RequestBody DeliveryAssignmentDTO dto) {
//        logger.info("Assign delivery request: Order {}, Agent {}", dto.getOrderId(), dto.getAgentId());
//        DeliveryDTO deliveryDTO = deliveryService.assignDeliveryAgent(dto);
//        logger.info("Delivery assigned: ID {}", deliveryDTO.getDeliveryId());
//        return new ResponseEntity<>(deliveryDTO, HttpStatus.CREATED);
//    }


//    @PostMapping("/assign")
//    @PreAuthorize("hasRole('ADMIN')")
//    @Operation(summary = "Assign Agent to Order", description = "Assigns a delivery agent to a specific order. Requires 'ADMIN' role.")
//    public ResponseEntity<DeliveryDTO> assignDelivery(@RequestBody DeliveryRequestDTO requestDto) { // Changed DTO type
//        logger.info("Assign delivery request: Order {}, Restaurant {}, Address {}",
//                requestDto.getOrderId(), requestDto.getRestaurantId(), requestDto.getDeliveryAddress());
//
//        // 1. Logic to find an available agent
//        Long availableAgentId = deliveryService.findAvailableAgent(); // New service method
//        if (availableAgentId == null) {
//            // Handle case where no agent is available (e.g., return 404/409, throw exception)
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Or a custom error DTO
//        }
//
//        // 2. Create the internal DTO for assignment, including the found agentId
//        DeliveryAssignmentDTO assignmentDto = new DeliveryAssignmentDTO();
//        assignmentDto.setOrderId(requestDto.getOrderId());
//        assignmentDto.setRestaurantId(requestDto.getRestaurantId());
//        assignmentDto.setDeliveryAddress(requestDto.getDeliveryAddress());
//        assignmentDto.setAgentId(availableAgentId); // Set the found agent ID
//
//        // 3. Proceed with assignment
//        DeliveryDTO deliveryDTO = deliveryService.assignDeliveryAgent(assignmentDto);
//        logger.info("Delivery assigned: ID {}", deliveryDTO.getDeliveryId());
//        return new ResponseEntity<>(deliveryDTO, HttpStatus.CREATED);
//    }


    @PostMapping("/assign")
//    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign Agent to Order", description = "Assigns a delivery agent to a specific order. Requires 'ADMIN' role.")
    public ResponseEntity<DeliveryDTO> assignDelivery(@RequestBody OrderDTO orderDTO) {
        logger.info("Assign delivery request received for Order ID {}", orderDTO.getOrderId());
        DeliveryDTO deliveryDTO = deliveryService.assignDelivery(orderDTO);
        logger.info("Delivery assigned: ID {}", deliveryDTO.getDeliveryId());
        return new ResponseEntity<>(deliveryDTO, HttpStatus.CREATED);
    }


    /**
     * Updates the status of an existing delivery.
     * This endpoint allows users with 'ADMIN' or 'DELIVERY_AGENT' roles to change the delivery status.
     * When the status is set to 'DELIVERED', the assigned agent's status is automatically updated to 'AVAILABLE'.
     *
     * @param deliveryId The unique identifier of the delivery to be updated.
     * @param dto        The {@link DeliveryStatusUpdateDTO} containing the new status and optionally
     * an updated estimated delivery time.
     * @return A {@link ResponseEntity} containing the updated {@link DeliveryDTO} and an HTTP status of 200 OK.
     * @throws com.delivery.delivery_service.exception.ResourceNotFoundException If the delivery specified by {@code deliveryId} is not found.
     * @throws com.delivery.delivery_service.exception.InvalidStatusException If the provided status string is not a valid
     * {@link com.delivery.delivery_service.entity.DeliveryStatus}.
     */
    @PatchMapping("/{deliveryId}/status")
//    @PreAuthorize("hasAnyRole('ADMIN', 'DELIVERY_AGENT')")
    @Operation(summary = "Update Delivery Status", description = "Updates the status of a delivery. Requires 'ADMIN' or 'DELIVERY_AGENT' role.")
    public ResponseEntity<DeliveryDTO> updateStatus(
            @PathVariable Long deliveryId,
            @RequestBody DeliveryStatusUpdateDTO dto) {
        logger.info("Update status request: Delivery ID {}, New Status {}", deliveryId, dto.getStatus());
        DeliveryDTO deliveryDTO = deliveryService.updateDeliveryStatus(deliveryId, dto);
        logger.info("Status updated for Delivery ID {}: {}", deliveryId, deliveryDTO.getStatus());
        return ResponseEntity.ok(deliveryDTO);
    }


    /**
     * Updates the status of an existing delivery.
     * This endpoint allows users with 'ADMIN' or 'DELIVERY_AGENT' roles to change the delivery status.
     * When the status is set to 'DELIVERED', the assigned agent's status is automatically updated to 'AVAILABLE'.
     *
     * @param orderId The unique identifier of the delivery to be updated.
     * @return A {@link ResponseEntity} containing the updated {@link DeliveryDTO} and an HTTP status of 200 OK.
     * @throws com.delivery.delivery_service.exception.ResourceNotFoundException If the delivery specified by {@code deliveryId} is not found.
     * @throws com.delivery.delivery_service.exception.InvalidStatusException If the provided status string is not a valid
     * {@link com.delivery.delivery_service.entity.DeliveryStatus}.
     */
    @GetMapping("/order/{orderId}")
//    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get Delivery Status by Order ID", description = "Retrieves the delivery status for a given Order ID. Requires authentication.")
    public ResponseEntity<DeliveryDTO> getDeliveryByOrder(@PathVariable Long orderId) {
        logger.info("Get delivery by Order ID request: {}", orderId);
        DeliveryDTO deliveryDTO = deliveryService.getDeliveryByOrderId(orderId);
        logger.info("Retrieved delivery for Order ID {}: Delivery ID {}", orderId, deliveryDTO.getDeliveryId());
        return ResponseEntity.ok(deliveryDTO);
    }
    
    @PostMapping("/agentPost")
    public ResponseEntity<AgentCreateDTO> agentAssigning(@RequestBody AgentCreateDTO newAgent) {
    	AgentCreateDTO agentCreateDTO = agentService.createAgent(newAgent);
    	return ResponseEntity.ok(agentCreateDTO);
    }
}