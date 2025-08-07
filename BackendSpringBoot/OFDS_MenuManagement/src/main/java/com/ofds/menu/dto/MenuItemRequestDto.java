package com.ofds.menu.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemRequestDto {
	
	@NotBlank(message = "Item name cannot be empty")
	@Size(min=5,max=50,message="Item name must be between 5 and 50 characters")
	private String itemName;
	
	@NotBlank(message = "Description cannot be empty or null")
	@Size(min=10,max=100,message="Description must be between 10 and 100 characters")
	private String description;
	
	@NotNull(message = "Price cannot be null")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
	private Double price;
	
	@NotNull(message = "Vegetarian status cannot be null (true for veg, false for non-veg)")
	private Boolean isVegetarian;
}
