package com.fooddelivery.orderservicef.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter

public class PaymentRequestDTO {
    private Long orderId;
    private double paymentAmount;
    private String createdBy;
    private PaymentMethod paymentMethod;
}