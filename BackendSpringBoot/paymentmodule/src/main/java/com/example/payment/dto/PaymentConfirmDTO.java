package com.example.payment.dto;

import lombok.Data;

@Data
public class PaymentConfirmDTO {
	
    private Long orderId;
    private String transactionId;
    private String status;
    private String updatedBy;
}
