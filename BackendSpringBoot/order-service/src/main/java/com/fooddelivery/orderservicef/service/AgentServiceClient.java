package com.fooddelivery.orderservicef.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.fooddelivery.orderservicef.dto.AgentAssignmentDTO;
import com.fooddelivery.orderservicef.dto.AgentCreateDTO;
import com.fooddelivery.orderservicef.dto.AgentResponseDTO;
import com.fooddelivery.orderservicef.dto.DeliveryStatusUpdateRequestDTO;

@FeignClient(name = "DELIVERY-SERVICE")
public interface AgentServiceClient {
    @PostMapping("/api/delivery/assign")
    AgentResponseDTO assignDeliveryAgent
    (@RequestBody AgentAssignmentDTO assignmentDTO);
    /**
     * Updates the status of a specific delivery in the Delivery Service.
     *
     * @param deliveryId The ID of the delivery to update.
     * @param statusUpdateDTO The DTO containing the new status and optional ETA.
     * @param authToken The authorization token to be passed to the delivery service.
     * @return DeliveryAssignmentResponseDTO representing the updated delivery.
     */
    @PatchMapping("/api/delivery/{deliveryId}/status")
    AgentResponseDTO updateDeliveryStatus(
            @PathVariable("deliveryId") Long deliveryId,
            @RequestBody DeliveryStatusUpdateRequestDTO statusUpdateDTO
    );
    
    @PostMapping("/api/delivery/agentPost")
	AgentResponseDTO createAgent(AgentCreateDTO newAgent);
    
    
}