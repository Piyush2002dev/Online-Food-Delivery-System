package com.ofds.menu.service;

import java.util.List;
import com.ofds.menu.dto.MenuItemRequestDto;
import com.ofds.menu.dto.MenuItemResponseDto;
import com.ofds.menu.dto.ResponseMessageDto;

public interface MenuItemService {
	
	ResponseMessageDto createMenuItem(Long resturantId,MenuItemRequestDto menuItemRequestDto);
	ResponseMessageDto updateMenuItem(Long  itemId, MenuItemRequestDto menuItemRequestDto);
	ResponseMessageDto deleteMenuItem(Long itemId);
	MenuItemResponseDto getMenuItemById(Long itemId);
	List<MenuItemResponseDto> getAllMenuItemsByResturant(Long resturantId);
	List<MenuItemResponseDto> getMenuItemByCategory(Long restaurantId, Boolean isVegetarian);
	List<Long> getMenuItemsBySimilarName(String itemName);
}
