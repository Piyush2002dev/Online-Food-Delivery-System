package com.delivery.delivery_service.dto;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder// Order DTO for getting input from Order-Servicepublic
public class OrderDTO {
	private Long orderId;
	private Long restaurantId;
	private String deliveryAddress;
	}
 