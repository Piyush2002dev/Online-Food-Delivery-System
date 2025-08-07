package com.delivery.delivery_service.service;

import com.delivery.delivery_service.dto.DeliveryAssignmentDTO;
import com.delivery.delivery_service.dto.DeliveryDTO;
import com.delivery.delivery_service.dto.DeliveryStatusUpdateDTO;
import com.delivery.delivery_service.entity.AgentEntity;
import com.delivery.delivery_service.entity.AgentStatus;
import com.delivery.delivery_service.entity.DeliveryEntity;
import com.delivery.delivery_service.entity.DeliveryStatus;
import com.delivery.delivery_service.exception.*;
import com.delivery.delivery_service.repository.AgentRepository;
import com.delivery.delivery_service.repository.DeliveryRepository;
import com.delivery.delivery_service.service.impl.DeliveryServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DeliveryServiceTest {

    @Mock
    private AgentRepository agentRepository;

    @Mock
    private DeliveryRepository deliveryRepository;

    @InjectMocks
    private DeliveryServiceImpl deliveryService;

    private AgentEntity availableAgent;
    private AgentEntity assignedAgent;
    private DeliveryEntity inProgressDelivery;
    private DeliveryAssignmentDTO validAssignmentDTO;
    private DeliveryStatusUpdateDTO deliveredStatusDTO;

    @BeforeEach
    void setUp() {
        availableAgent = AgentEntity.builder()
                .agentId(501L)
                .agentName("John Doe")
                .agentPhoneNumber("1234567890")
                .agentStatus(AgentStatus.AVAILABLE)
                .build();

        assignedAgent = AgentEntity.builder()
                .agentId(502L)
                .agentName("Jane Smith")
                .agentPhoneNumber("0987654321")
                .agentStatus(AgentStatus.ASSIGNED)
                .build();

        inProgressDelivery = DeliveryEntity.builder()
                .deliveryId(100L)
                .orderId(101L)
                .deliveryStatus(DeliveryStatus.IN_PROGRESS)
                .estimatedTimeOfArrival(LocalDateTime.now().plusMinutes(30))
                .agent(availableAgent)
                .createdBy("admin")
                .createdOn(LocalDateTime.now())
                .updatedBy("admin")
                .updatedOn(LocalDateTime.now())
                .build();

        validAssignmentDTO = new DeliveryAssignmentDTO(
                101L,                   // orderId
                201L,                   // restaurantId
                "123 Main Street",      // deliveryAddress
                501L                    // agentId
        );

        deliveredStatusDTO = new DeliveryStatusUpdateDTO("DELIVERED", LocalDateTime.now().plusMinutes(10));
    }

    @Test
    @DisplayName("Should assign delivery successfully")
    void assignDelivery_Success() {
        when(deliveryRepository.existsByOrderId(validAssignmentDTO.getOrderId())).thenReturn(false);
        when(agentRepository.findById(validAssignmentDTO.getAgentId())).thenReturn(Optional.of(availableAgent));
        when(deliveryRepository.save(any(DeliveryEntity.class))).thenReturn(inProgressDelivery);

        DeliveryDTO result = deliveryService.assignDeliveryAgent(validAssignmentDTO);

        assertNotNull(result);
        assertEquals(validAssignmentDTO.getOrderId(), result.getOrderId());
        assertEquals(validAssignmentDTO.getAgentId(), result.getAgentId());
        assertEquals("IN_PROGRESS", result.getStatus());
        verify(agentRepository, times(1)).save(availableAgent);
        verify(deliveryRepository, times(1)).save(any(DeliveryEntity.class));
    }

    @Test
    void assignDelivery_InvalidOrderId() {
        DeliveryAssignmentDTO dto = new DeliveryAssignmentDTO(0L, 201L, "abc", 501L);
        assertThrows(InvalidOrderIdException.class, () -> deliveryService.assignDeliveryAgent(dto));
    }

    @Test
    void assignDelivery_InvalidAgentId() {
        DeliveryAssignmentDTO dto = new DeliveryAssignmentDTO(101L, 201L, "abc", 0L);
        assertThrows(InvalidAgentIdException.class, () -> deliveryService.assignDeliveryAgent(dto));
    }

    @Test
    void assignDelivery_DuplicateOrder() {
        when(deliveryRepository.existsByOrderId(validAssignmentDTO.getOrderId())).thenReturn(true);
        assertThrows(DuplicateAssignmentException.class, () -> deliveryService.assignDeliveryAgent(validAssignmentDTO));
    }

    @Test
    void assignDelivery_AgentNotFound() {
        when(deliveryRepository.existsByOrderId(validAssignmentDTO.getOrderId())).thenReturn(false);
        when(agentRepository.findById(validAssignmentDTO.getAgentId())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> deliveryService.assignDeliveryAgent(validAssignmentDTO));
    }

    @Test
    void assignDelivery_AgentAlreadyAssigned() {
        when(deliveryRepository.existsByOrderId(validAssignmentDTO.getOrderId())).thenReturn(false);
        when(agentRepository.findById(assignedAgent.getAgentId())).thenReturn(Optional.of(assignedAgent));

        DeliveryAssignmentDTO dto = new DeliveryAssignmentDTO(101L, 201L, "abc", 502L);
        assertThrows(DuplicateAssignmentException.class, () -> deliveryService.assignDeliveryAgent(dto));
    }

    // You can reuse your updateDeliveryStatus and getDeliveryByOrderId tests without changes
}