package com.ofds.menu.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.ofds.menu.dto.MenuItemRequestDto;
import com.ofds.menu.dto.MenuItemResponseDto;
import com.ofds.menu.dto.ResponseMessageDto;
import com.ofds.menu.service.MenuItemService;



/**
 * Controller for handling menu related operations.
 * Provides REST API endpoints for adding, deleting, updating, viewing the menu.
 * 
 */
@RestController
@RequestMapping("/api/menu")
@Validated
public class MenuItemController {
	
	private MenuItemService menuItemService;

	public MenuItemController(MenuItemService menuItemService) {
		super();
		this.menuItemService = menuItemService;
	}

	/**
	 * Adds a new item into the menu.
	 * @param dto to the menu item deatils that we are adding.
	 * @return ResponseEntity containing item added response.
	 */
	@PostMapping("/restaurant")
	public ResponseEntity<ResponseMessageDto> createMenuItem(@Valid @RequestBody MenuItemRequestDto menuItemRequestDto,
			@RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles){
		
		if (!roles.contains("RESTAURANT")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
		
		return new ResponseEntity<>(menuItemService.createMenuItem(Long.valueOf(requestId) ,menuItemRequestDto), HttpStatus.CREATED);
	}

	/**
	 * Updates exsisting item in the menu.
	 * @param itemId to the item that needed to be updated.
	 * @param dto to the menu item details that we are updating.
	 * @return ResponseEntity containig item updated response.
	 */
	@PutMapping("/{itemId}")
	public ResponseEntity<ResponseMessageDto> updateMenuItem(@PathVariable Long itemId,@Valid @RequestBody MenuItemRequestDto menuItemRequestDto,
															@RequestHeader("X-Internal-User-Roles")String roles){
		
		if (!roles.contains("RESTAURANT")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
		return new ResponseEntity<>(menuItemService.updateMenuItem(itemId, menuItemRequestDto),HttpStatus.OK);
	}

	/**
	 * Deletes item that no longer needed.
	 * @param itemId to the item that needed to be deleted.
	 * @return ResponseEntity containing item deleted response.
	 */
	@DeleteMapping("/{itemId}")
	public ResponseEntity<String> deleteMenuItem(@PathVariable Long itemId, @RequestHeader("X-Internal-User-Roles")String roles){
		
		if (!roles.contains("RESTAURANT")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
		menuItemService.deleteMenuItem(itemId);
		return new ResponseEntity<>("Item Deleted...",HttpStatus.OK);
	}
	
	/**
	 * Views item detials by  itemID.
	 * @param itemId to the item that needed to be viewed.
	 * @return ResponseEntity containing item details.
	 */
	@GetMapping("/{itemId}")
	public ResponseEntity<MenuItemResponseDto> getMenuItemById(@PathVariable Long itemId){

		return new ResponseEntity<>(menuItemService.getMenuItemById(itemId),HttpStatus.OK);
	}
	
	/**
	 * Views item details by the restaurant Id.
	 * @param restaurantId to the restaurant that the List of item that needed to be viewed.
	 * @return ResposeEntity containing list of items from the selected resturant by ID.
	 */
	@GetMapping("/restaurant/{restaurantId}")
	public ResponseEntity<List<MenuItemResponseDto>> getMenuItemsByResturant(@PathVariable Long restaurantId){

		return new ResponseEntity<>(menuItemService.getAllMenuItemsByResturant(Long.valueOf(restaurantId)),HttpStatus.OK);
	}
	
//	@GetMapping("/restaurant/category")
//	public ResponseEntity<List<MenuItemResponseDto>> getMenuItemByCategory(@RequestHeader("X-Internal-User-Id") String requestId,
//			@RequestHeader("X-Internal-User-Roles")String roles,
//			@RequestParam("isVeg") @NotNull(message = "Item category cannot be blank") Boolean isVegetarian){
//		
//		if (!roles.contains("RESTAURANT")||!roles.contains("CUSTOMER")) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//		return new ResponseEntity<>(menuItemService.getMenuItemByCategory(Long.valueOf(requestId),isVegetarian),HttpStatus.OK);
//	}
//
//	@GetMapping("/search")
//	public ResponseEntity<List<Long>> getMenuItemsBySimilarName(@RequestParam @NotBlank(message = "Item name cannot be blank for search.") String itemName,
//			@RequestHeader("X-Internal-User-Roles")String roles) {
//		
//		if (!roles.contains("CUSTOMER")) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//		return new ResponseEntity<>(menuItemService.getMenuItemsBySimilarName(itemName), HttpStatus.OK);
//	}
}
