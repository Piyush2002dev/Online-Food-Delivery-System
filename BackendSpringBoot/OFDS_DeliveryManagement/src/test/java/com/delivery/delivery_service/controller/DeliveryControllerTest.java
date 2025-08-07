package com.delivery.delivery_service.controller;

import com.delivery.delivery_service.dto.*;
import com.delivery.delivery_service.exception.*;
import com.delivery.delivery_service.service.DeliveryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeliveryControllerTest {

    @InjectMocks
    private DeliveryController deliveryController;

    @Mock
    private DeliveryService deliveryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private DeliveryDTO mockDeliveryDTO() {
        return DeliveryDTO.builder()
                .deliveryId(1L)
                .orderId(100L)
                .agentId(501L)
                .agentName("Test Agent")
                .agentPhone("9876543210")
                .status("IN_PROGRESS")
                .estimatedDeliveryTime(LocalDateTime.now().plusMinutes(30))
                .build();
    }

    // --- Assign Delivery Tests with OrderDTO ---

    @Test
    void testAssignDelivery_Success() {
        // Arrange
        OrderDTO orderDTO = new OrderDTO(100L, 10L, "456 Street, City");
        DeliveryDTO expected = mockDeliveryDTO();

        when(deliveryService.assignDelivery(orderDTO)).thenReturn(expected);

        // Act
        ResponseEntity<DeliveryDTO> response = deliveryController.assignDelivery(orderDTO);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expected, response.getBody());
        verify(deliveryService, times(1)).assignDelivery(orderDTO);
    }

    @Test
    void testAssignDelivery_InvalidOrderId() {
        OrderDTO orderDTO = new OrderDTO(0L, 10L, "Invalid Address");
        String error = "Invalid Order ID";

        when(deliveryService.assignDelivery(orderDTO)).thenThrow(new InvalidOrderIdException(error));

        InvalidOrderIdException thrown = assertThrows(InvalidOrderIdException.class, () -> {
            deliveryController.assignDelivery(orderDTO);
        });

        assertEquals(error, thrown.getMessage());
        verify(deliveryService, times(1)).assignDelivery(orderDTO);
    }

    @Test
    void testAssignDelivery_NoAgentAvailable() {
        OrderDTO orderDTO = new OrderDTO(101L, 20L, "No Agents Location");
        String error = "No available agents";

        when(deliveryService.assignDelivery(orderDTO)).thenThrow(new ResourceNotFoundException(error));

        ResourceNotFoundException thrown = assertThrows(ResourceNotFoundException.class, () -> {
            deliveryController.assignDelivery(orderDTO);
        });

        assertEquals(error, thrown.getMessage());
        verify(deliveryService, times(1)).assignDelivery(orderDTO);
    }

    @Test
    void testAssignDelivery_AlreadyAssignedOrder() {
        OrderDTO orderDTO = new OrderDTO(102L, 30L, "Already Assigned");
        String error = "Order already has a delivery assigned";

        when(deliveryService.assignDelivery(orderDTO)).thenThrow(new DuplicateAssignmentException(error));

        DuplicateAssignmentException thrown = assertThrows(DuplicateAssignmentException.class, () -> {
            deliveryController.assignDelivery(orderDTO);
        });

        assertEquals(error, thrown.getMessage());
        verify(deliveryService, times(1)).assignDelivery(orderDTO);
    }

    // --- Update Delivery Status Tests ---

    @Test
    void testUpdateDeliveryStatus_Success() {
        Long deliveryId = 1L;
        DeliveryStatusUpdateDTO dto = new DeliveryStatusUpdateDTO("DELIVERED", LocalDateTime.now());
        DeliveryDTO updated = mockDeliveryDTO();
        updated.setStatus("DELIVERED");

        when(deliveryService.updateDeliveryStatus(deliveryId, dto)).thenReturn(updated);

        ResponseEntity<DeliveryDTO> response = deliveryController.updateStatus(deliveryId, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updated, response.getBody());
        verify(deliveryService, times(1)).updateDeliveryStatus(deliveryId, dto);
    }

    @Test
    void testUpdateDeliveryStatus_InvalidStatus() {
        Long deliveryId = 1L;
        DeliveryStatusUpdateDTO dto = new DeliveryStatusUpdateDTO("UNKNOWN", LocalDateTime.now());
        String error = "Invalid status";

        when(deliveryService.updateDeliveryStatus(deliveryId, dto)).thenThrow(new InvalidStatusException(error));

        InvalidStatusException thrown = assertThrows(InvalidStatusException.class, () -> {
            deliveryController.updateStatus(deliveryId, dto);
        });

        assertEquals(error, thrown.getMessage());
        verify(deliveryService, times(1)).updateDeliveryStatus(deliveryId, dto);
    }

    @Test
    void testUpdateDeliveryStatus_NotFound() {
        Long deliveryId = 999L;
        DeliveryStatusUpdateDTO dto = new DeliveryStatusUpdateDTO("DELIVERED", LocalDateTime.now());
        String error = "Delivery not found";

        when(deliveryService.updateDeliveryStatus(deliveryId, dto)).thenThrow(new ResourceNotFoundException(error));

        ResourceNotFoundException thrown = assertThrows(ResourceNotFoundException.class, () -> {
            deliveryController.updateStatus(deliveryId, dto);
        });

        assertEquals(error, thrown.getMessage());
        verify(deliveryService, times(1)).updateDeliveryStatus(deliveryId, dto);
    }

    // --- Get Delivery By Order ID Tests ---

    @Test
    void testGetDeliveryByOrderId_Success() {
        Long orderId = 100L;
        DeliveryDTO expected = mockDeliveryDTO();

        when(deliveryService.getDeliveryByOrderId(orderId)).thenReturn(expected);

        ResponseEntity<DeliveryDTO> response = deliveryController.getDeliveryByOrder(orderId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
        verify(deliveryService, times(1)).getDeliveryByOrderId(orderId);
    }

    @Test
    void testGetDeliveryByOrderId_NotFound() {
        Long orderId = 404L;
        String error = "Delivery not found";

        when(deliveryService.getDeliveryByOrderId(orderId)).thenThrow(new ResourceNotFoundException(error));

        ResourceNotFoundException thrown = assertThrows(ResourceNotFoundException.class, () -> {
            deliveryController.getDeliveryByOrder(orderId);
        });

        assertEquals(error, thrown.getMessage());
        verify(deliveryService, times(1)).getDeliveryByOrderId(orderId);
    }
}