package com.fooddelivery.orderservicef.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor

@AllArgsConstructor

public class MenuItemDTO {

	private Long RestaurantId;
	private String itemName;
	private String description;
	private Double price;
	private Boolean isAvailable;	
	private Boolean isVegetarian;
}