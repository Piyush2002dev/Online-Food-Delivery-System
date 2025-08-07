package com.example.Restaurant.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantRegisterDTO {

    @NotBlank(message="Name is required")
	private String name;
    @NotBlank(message="Location is required")
    private String location;
    @NotBlank(message="Email is required")
    @Email(message="Enter a valid Email")
    private String email;
    @NotBlank(message="Password is required")
    private String password;
}
