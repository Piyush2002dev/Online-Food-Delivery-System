package com.fooddelivery.orderservicef.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerProfileDTO {
    private Long id;
    private String name;
    private Long phone;
    private String address;
    private String email;
} 