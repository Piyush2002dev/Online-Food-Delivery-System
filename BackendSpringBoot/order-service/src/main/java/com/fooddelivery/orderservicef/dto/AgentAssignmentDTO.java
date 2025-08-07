package com.fooddelivery.orderservicef.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AgentAssignmentDTO {
    private Long orderId;
    private Long restaurantId;
    private String DeliveryAddress;
}
