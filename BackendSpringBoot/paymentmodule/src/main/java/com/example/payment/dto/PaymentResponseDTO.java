package com.example.payment.dto;

import java.math.BigDecimal;

import com.example.payment.model.PaymentMethod;
import lombok.Data;
 
@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private Long orderId;
    private PaymentMethod paymentMethod;
    private BigDecimal paymentAmount;
    private String paymentStatus;
	
	

	public Object getTransactionId() {
		
		return orderId;
	}
	

}
