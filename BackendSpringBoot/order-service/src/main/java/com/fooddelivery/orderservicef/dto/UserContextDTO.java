package com.fooddelivery.orderservicef.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserContextDTO {
    private Long userId;
    private String email;      // From JWT claims
    private String username;   // From JWT claims
}