package com.ofds.menu.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "menu_item")
public class MenuItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long itemId;
	
	@Column(name = "restaurant_id",nullable = false)
	private Long restaurantId;
	
	@Column(name = "item_name", nullable = false, length = 100)
	private String itemName;
	
	@Column(name = "description", length = 500, nullable = false)
	private String description;
	
	@Column(name = "isVegetarian", nullable = false)
	private Boolean isVegetarian;
	
	@Column(name = "price", nullable = false)
	private Double price;
	
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt = LocalDateTime.now();
	
	@Column(name = "created_by")
	private String createdBy;
	
	@Column(name = "updated_at")
	private LocalDateTime updatedAt = LocalDateTime.now();
	
	@Column(name = "updated_by")
	private String updatedBy;

}
