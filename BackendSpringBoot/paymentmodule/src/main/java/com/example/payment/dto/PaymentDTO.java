package com.example.payment.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Long orderId;
    private String paymentMethod;
    private BigDecimal paymentAmount;
    private String createdBy;
    
}
