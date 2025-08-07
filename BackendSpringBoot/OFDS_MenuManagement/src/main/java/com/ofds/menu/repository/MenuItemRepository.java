package com.ofds.menu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ofds.menu.entity.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long>{
	

	List<MenuItem> findByRestaurantId(Long restaurantId);

	Optional<MenuItem> findByRestaurantIdAndItemName(Long restaurantId, String itemName);
	
	Optional<MenuItem> findByItemName(String itemName);
	
	List<MenuItem> findByRestaurantIdAndIsVegetarian(Long restaurantId, Boolean isVegetarian);
	
	List<MenuItem> findByItemNameContainingIgnoreCase(String itemName);
}
