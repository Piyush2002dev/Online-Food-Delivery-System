package com.example.Restaurant.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class RestaurantLoginDTO {
	
	@NotBlank(message="Email is required")
	@Email(message="Invaid Email")
    private String email;
	@NotBlank(message="Password is required")
    private String password;
}
