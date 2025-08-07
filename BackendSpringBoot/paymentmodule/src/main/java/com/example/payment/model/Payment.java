package com.example.payment.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Entity
@Table(name = "Payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPayment;
 
    
    private Long orderId;
 
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
 
    private BigDecimal paymentAmount;
 
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
 
    private String createdBy;
    private LocalDateTime createdOn = LocalDateTime.now();
    private String updatedBy;
    private LocalDateTime updatedOn = LocalDateTime.now();
    
    @PrePersist
    public void onCreate() {
    	this.createdOn=LocalDateTime.now();
    }
   
    @PreUpdate
    public void onUpdate() {
    	this.updatedOn=LocalDateTime.now();
    	
    }

}