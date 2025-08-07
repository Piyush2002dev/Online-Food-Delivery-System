package com.fooddelivery.orderservicef.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
	private Long paymentId;
    private Long orderId;
    private Double paymentAmount;
    private PaymentMethod paymentMethod;
    private String createdOn;
    private String paymentStatus;

}