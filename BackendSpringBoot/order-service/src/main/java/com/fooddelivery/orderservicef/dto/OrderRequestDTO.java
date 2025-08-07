package com.fooddelivery.orderservicef.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//import com.example.payment.model.PaymentMethod; // ✅ Added PaymentMethod import

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    private Long userId;
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    private List<OrderItemDTO> items;
    private String paymentMethod; // ✅ Added payment method as String
}