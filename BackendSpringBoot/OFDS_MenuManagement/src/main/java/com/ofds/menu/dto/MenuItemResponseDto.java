package com.ofds.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemResponseDto {
	
	private Long itemId;
	private Long restaurantId;
	private String itemName;
	private String description;
	private Double price;	
	private Boolean isVegetarian;
}
