package com.ofds.menu.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.eq;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ofds.menu.controller.MenuItemController;
import com.ofds.menu.dto.MenuItemRequestDto;
import com.ofds.menu.dto.MenuItemResponseDto;
import com.ofds.menu.dto.ResponseMessageDto;
import com.ofds.menu.exception.DuplicateMenuItemException;
import com.ofds.menu.exception.InvalidItemIdException;
import com.ofds.menu.exception.InvalidRestaurantIdException;
import com.ofds.menu.exception.MenuItemNotFoundException;
import com.ofds.menu.exception.NoItemsInRestaurantException;
import com.ofds.menu.service.MenuItemService;
import com.ofds.menu.util.AppConstants;

@WebMvcTest(MenuItemController.class)
class MenuItemControllerTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@SuppressWarnings("removal")
	@MockBean
	private MenuItemService menuItemService;
	
	private MenuItemRequestDto menuItemRequestDto;
	private MenuItemResponseDto menuItemResponseDto;
	private MenuItemResponseDto vegMenuItemResponseDto;
	private MenuItemResponseDto nonVegMenuItemResponseDto;
	private ResponseMessageDto successMessageDto;
	private ResponseMessageDto updateMessageDto;
	private ResponseMessageDto deleteMessageDto;
	
	@BeforeEach
	void setUp() {
		menuItemRequestDto = new MenuItemRequestDto("Pizza","Delicious cheese pizza",12.99,true);
		menuItemResponseDto = new MenuItemResponseDto("Pizza","Delicious cheese pizza",12.99,true);
		vegMenuItemResponseDto = new MenuItemResponseDto( "Veggie Delight", "A delicious vegetarian pizza", 15.00,true);
		nonVegMenuItemResponseDto = new MenuItemResponseDto("Pepperoni Feast", "Classic pepperoni pizza", 18.50, false);
		successMessageDto = new ResponseMessageDto(AppConstants.ITEM_ADDED);
		updateMessageDto = new ResponseMessageDto(AppConstants.ITEM_UPDATED);
		deleteMessageDto = new ResponseMessageDto(AppConstants.ITEM_DELETD);
	}
	
	@Test
	@DisplayName("should return 201 Created when a menu item is successfully created")
	void createMenuItem_Success() throws Exception{
		Long restaurantId = 1L;
		when(menuItemService.createMenuItem(eq(restaurantId), any(MenuItemRequestDto.class))).thenReturn(successMessageDto);
		mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", restaurantId)
				.contentType(MediaType.APPLICATION_JSON)
			   	.content(objectMapper.writeValueAsString(menuItemRequestDto)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.message").value(AppConstants.ITEM_ADDED));
		verify(menuItemService, times(1)).createMenuItem(eq(restaurantId), any(MenuItemRequestDto.class));
	}

	@Test
	@DisplayName("should return 400 Bad Request for invalid restaurant ID in createMenuItem")
	void createMenuItem_InvalidRestaurantId() throws Exception{
		Long invalidRestaurantId = 0L;
		when(menuItemService.createMenuItem(eq(invalidRestaurantId),any(MenuItemRequestDto.class))).thenThrow(new InvalidRestaurantIdException(AppConstants.INVALID_RESTAURANTID + invalidRestaurantId));
		
		mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", invalidRestaurantId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuItemRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(AppConstants.INVALID_RESTAURANTID + invalidRestaurantId));

        verify(menuItemService, times(1)).createMenuItem(eq(invalidRestaurantId), any(MenuItemRequestDto.class));
	}

	@Test
    @DisplayName("should return 409 Conflict for duplicate menu item creation")
    void createMenuItem_DuplicateItem() throws Exception {
        Long restaurantId = 1L;
        String duplicateItemName = "Pizza";
        when(menuItemService.createMenuItem(eq(restaurantId), any(MenuItemRequestDto.class)))
                .thenThrow(new DuplicateMenuItemException(AppConstants.DUPLICATE_ITEM + duplicateItemName));

        mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", restaurantId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuItemRequestDto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(AppConstants.DUPLICATE_ITEM + duplicateItemName));

        verify(menuItemService, times(1)).createMenuItem(eq(restaurantId), any(MenuItemRequestDto.class));
    }
	
	@Test
    @DisplayName("should return 400 Bad Request for missing itemName in createMenuItem payload due to @Valid")
    void createMenuItem_Validation_MissingItemName() throws Exception {
        MenuItemRequestDto invalidRequestDto = new MenuItemRequestDto(
            null, "A valid description for pizza", 12.99, true
        );

        mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.itemName").value("Item name cannot be empty"));

        verifyNoInteractions(menuItemService);
    }
	
	@Test
    @DisplayName("should return 400 Bad Request for short itemName in createMenuItem payload due to @Valid")
    void createMenuItem_Validation_ShortItemName() throws Exception {
        MenuItemRequestDto invalidRequestDto = new MenuItemRequestDto(
            "Piz", "A valid description for pizza", 12.99, true
        );

        mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.itemName").value("Item name must be between 5 and 50 characters"));

        verifyNoInteractions(menuItemService);
    }
	
	@Test
    @DisplayName("should return 400 Bad Request for null price in createMenuItem payload due to @Valid")
    void createMenuItem_Validation_NullPrice() throws Exception {
        MenuItemRequestDto invalidRequestDto = new MenuItemRequestDto(
            "Delicious Pizza", "A valid description for pizza", null, true
        );

        mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.price").value("Price cannot be null"));

        verifyNoInteractions(menuItemService);
    }

    @Test
    @DisplayName("should return 400 Bad Request for price less than 0.01 in createMenuItem payload due to @Valid")
    void createMenuItem_Validation_MinPrice() throws Exception {
        MenuItemRequestDto invalidRequestDto = new MenuItemRequestDto(
            "Delicious Pizza", "A valid description for pizza", 0.00, true
        );

        mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.price").value("Price must be greater than 0"));

        verifyNoInteractions(menuItemService);
    }


    @Test
    @DisplayName("should return 400 Bad Request for multiple validation errors in createMenuItem payload")
    void createMenuItem_Validation_MultipleErrors() throws Exception {
        MenuItemRequestDto invalidRequestDto = new MenuItemRequestDto("Piz",null,-10.0,null);

        mockMvc.perform(post("/api/v1/menu/restaurant/{restaurantId}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.itemName").exists())
                .andExpect(jsonPath("$.description").exists())
                .andExpect(jsonPath("$.price").exists())
                .andExpect(jsonPath("$.imageUrl").exists())
                .andExpect(jsonPath("$.isAvailable").exists());

        verifyNoInteractions(menuItemService);
    }


    @Test
    @DisplayName("should return 200 OK when a menu item is successfully updated")
    void updateMenuItem_Success() throws Exception {
        Long itemId = 101L;
        when(menuItemService.updateMenuItem(eq(itemId), any(MenuItemRequestDto.class)))
                .thenReturn(updateMessageDto);

        mockMvc.perform(put("/api/v1/menu/{itemId}", itemId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuItemRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(AppConstants.ITEM_UPDATED));

        verify(menuItemService, times(1)).updateMenuItem(eq(itemId), any(MenuItemRequestDto.class));
    }

    @Test
    @DisplayName("should return 404 Not Found when updating a non-existent menu item")
    void updateMenuItem_NotFound() throws Exception {
        Long itemId = 999L;
        when(menuItemService.updateMenuItem(eq(itemId), any(MenuItemRequestDto.class)))
                .thenThrow(new MenuItemNotFoundException(AppConstants.ITEM_NOTFOUND + itemId));

        mockMvc.perform(put("/api/v1/menu/{itemId}", itemId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuItemRequestDto)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.ITEM_NOTFOUND + itemId));

        verify(menuItemService, times(1)).updateMenuItem(eq(itemId), any(MenuItemRequestDto.class));
    }

    @Test
    @DisplayName("should return 400 Bad Request for invalid request body (validation failure) on update")
    void updateMenuItem_Validation_NullDescription() throws Exception {
        Long itemId = 101L;
        MenuItemRequestDto invalidRequestDto = new MenuItemRequestDto("ValidName", null, 10.0, true);

        mockMvc.perform(put("/api/v1/menu/{itemId}", itemId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.description").value("Description cannot be empty or null"));

        verifyNoInteractions(menuItemService); 
    }


    @Test
    @DisplayName("should return 200 OK and 'Item Deleted...' when a menu item is successfully deleted")
    void deleteMenuItem_Success() throws Exception {
        Long itemId = 101L;
        when(menuItemService.deleteMenuItem(itemId)).thenReturn(deleteMessageDto);

        mockMvc.perform(delete("/api/v1/menu/{itemId}", itemId))
                .andExpect(status().isOk())
                .andExpect(content().string("Item Deleted...")); 

        verify(menuItemService, times(1)).deleteMenuItem(itemId);
    }

    @Test
    @DisplayName("should return 404 Not Found when deleting a non-existent menu item")
    void deleteMenuItem_NotFound() throws Exception {
        Long itemId = 999L;
        doThrow(new MenuItemNotFoundException(AppConstants.ITEM_NOTFOUND + itemId))
                .when(menuItemService).deleteMenuItem(itemId);

        mockMvc.perform(delete("/api/v1/menu/{itemId}", itemId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.ITEM_NOTFOUND + itemId));

        verify(menuItemService, times(1)).deleteMenuItem(itemId);
    }


    @Test
    @DisplayName("should return 200 OK when retrieving a menu item by ID")
    void getMenuItemById_Success() throws Exception {
        Long itemId = 101L;
        when(menuItemService.getMenuItemById(itemId)).thenReturn(menuItemResponseDto);

        mockMvc.perform(get("/api/v1/menu/{itemId}", itemId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemName").value(menuItemResponseDto.getItemName()))
                .andExpect(jsonPath("$.price").value(menuItemResponseDto.getPrice()));

        verify(menuItemService, times(1)).getMenuItemById(itemId);
    }


    @Test
    @DisplayName("should return 404 Not Found when retrieving a non-existent menu item by ID")
    void getMenuItemById_NotFound() throws Exception {
        Long itemId = 999L;
        when(menuItemService.getMenuItemById(itemId))
                .thenThrow(new MenuItemNotFoundException(AppConstants.ITEM_NOTFOUND + itemId));

        mockMvc.perform(get("/api/v1/menu/{itemId}", itemId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.ITEM_NOTFOUND + itemId));

        verify(menuItemService, times(1)).getMenuItemById(itemId);
    }

    @Test
    @DisplayName("should return 400 Bad Request for invalid item ID (e.g., zero/negative) in getMenuItemById")
    void getMenuItemById_InvalidItemId() throws Exception {
        Long invalidItemId = 0L;
        when(menuItemService.getMenuItemById(invalidItemId))
                .thenThrow(new InvalidItemIdException(AppConstants.INVALID_ITEMID + invalidItemId));

        mockMvc.perform(get("/api/v1/menu/{itemId}", invalidItemId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.INVALID_ITEMID + invalidItemId));

        verify(menuItemService, times(1)).getMenuItemById(invalidItemId);
    }


    @Test
    @DisplayName("should return 200 OK with a list of menu items for a restaurant")
    void getMenuItemsByResturant_Success() throws Exception {
        Long restaurantId = 1L;
        List<MenuItemResponseDto> menuItems = Arrays.asList(menuItemResponseDto, new MenuItemResponseDto("Classic Burger", "Classic beef burger with all the fixings", 8.50,false));
        when(menuItemService.getAllMenuItemsByResturant(restaurantId)).thenReturn(menuItems);

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}", restaurantId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].itemName").value(menuItemResponseDto.getItemName()))
                .andExpect(jsonPath("$[1].itemName").value("Classic Burger"));

        verify(menuItemService, times(1)).getAllMenuItemsByResturant(restaurantId);
    }

    @Test
    @DisplayName("should return 404 Not Found if no menu items are found for a restaurant")
    void getMenuItemsByResturant_NoItemsFound() throws Exception {
        Long restaurantId = 1L;
        when(menuItemService.getAllMenuItemsByResturant(restaurantId))
                .thenThrow(new NoItemsInRestaurantException(AppConstants.NOITEMS_IN_RESTAURANT + restaurantId));

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}", restaurantId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpected(jsonPath("$.message").value(AppConstants.NOITEMS_IN_RESTAURANT + restaurantId));

        verify(menuItemService, times(1)).getAllMenuItemsByResturant(restaurantId);
    }

    @Test
    @DisplayName("should return 400 Bad Request for invalid restaurant ID on getMenuItemsByRestaurant")
    void getMenuItemsByResturant_InvalidRestaurantId() throws Exception {
        Long invalidRestaurantId = 0L;
        when(menuItemService.getAllMenuItemsByResturant(invalidRestaurantId))
                .thenThrow(new InvalidRestaurantIdException(AppConstants.INVALID_RESTAURANTID + invalidRestaurantId));

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}", invalidRestaurantId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.INVALID_RESTAURANTID + invalidRestaurantId));

        verify(menuItemService, times(1)).getAllMenuItemsByResturant(invalidRestaurantId);
    }
    
    @Test
    @DisplayName("should return 200 OK with a list of vegetarian menu items")
    void getMenuItemsByRestaurantAndCategory_Vegetarian_Success() throws Exception {
        Long restaurantId = 1L;
        Boolean isVegetarian = true;
        List<MenuItemResponseDto> vegItems = Collections.singletonList(vegMenuItemResponseDto);

        when(menuItemService.getMenuItemByCategory(restaurantId, isVegetarian)).thenReturn(vegItems);

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}/category", restaurantId)
                .param("isVeg", String.valueOf(isVegetarian)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].itemName").value(vegMenuItemResponseDto.getItemName()))
                .andExpect(jsonPath("$[0].isVegetarian").value(true));

        verify(menuItemService, times(1)).getMenuItemByCategory(restaurantId, isVegetarian);
    }
    
    @Test
    @DisplayName("should return 200 OK with a list of non-vegetarian menu items")
    void getMenuItemsByRestaurantAndCategory_NonVegetarian_Success() throws Exception {
        Long restaurantId = 1L;
        Boolean isVegetarian = false;
        List<MenuItemResponseDto> nonVegItems = Collections.singletonList(nonVegMenuItemResponseDto);

        when(menuItemService.getMenuItemByCategory(restaurantId, isVegetarian)).thenReturn(nonVegItems);

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}/category", restaurantId)
                .param("isVeg", String.valueOf(isVegetarian)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].itemName").value(nonVegMenuItemResponseDto.getItemName()))
                .andExpected(jsonPath("$[0].isVegetarian").value(false));

        verify(menuItemService, times(1)).getMenuItemByCategory(restaurantId, isVegetarian);
    }
    
    @Test
    @DisplayName("should return 400 Bad Request for invalid restaurant ID on getMenuItemByCategory")
    void getMenuItemsByRestaurantAndCategory_InvalidRestaurantId() throws Exception {
        Long invalidRestaurantId = 0L;
        Boolean isVegetarian = true;

        when(menuItemService.getMenuItemByCategory(invalidRestaurantId, isVegetarian))
                .thenThrow(new InvalidRestaurantIdException(AppConstants.INVALID_RESTAURANTID + invalidRestaurantId));

        mockMvc.perform(get("/api/v1/menu/restaurant/{invalidRestaurantId}/category", invalidRestaurantId)
                .param("isVeg", String.valueOf(isVegetarian)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.INVALID_RESTAURANTID + invalidRestaurantId));

        verify(menuItemService, times(1)).getMenuItemByCategory(invalidRestaurantId, isVegetarian);
    }
    
    @Test
    @DisplayName("should return 404 Not Found when no items are found for the specified category")
    void getMenuItemsByRestaurantAndCategory_NoItemsFound() throws Exception {
        Long restaurantId = 1L;
        Boolean isVegetarian = true; // Looking for vegetarian items

        when(menuItemService.getMenuItemByCategory(restaurantId, isVegetarian))
                .thenThrow(new NoItemsInRestaurantException(AppConstants.NO_CATEGORY_ITEMS+restaurantId));

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}/category", restaurantId)
                .param("isVeg", String.valueOf(isVegetarian)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.NO_CATEGORY_ITEMS+restaurantId));

        verify(menuItemService, times(1)).getMenuItemByCategory(restaurantId, isVegetarian);
    }
    
    @Test
    @DisplayName("should return 400 Bad Request when 'isVeg' query parameter is missing")
    void getMenuItemsByRestaurantAndCategory_MissingIsVegParam() throws Exception {
        Long restaurantId = 1L;

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}/category", restaurantId))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(menuItemService);
    }
    
    @Test
    @DisplayName("should return 400 Bad Request when 'isVeg' query parameter is invalid (not boolean)")
    void getMenuItemsByRestaurantAndCategory_InvalidIsVegParam() throws Exception {
        Long restaurantId = 1L;

        mockMvc.perform(get("/api/v1/menu/restaurant/{restaurantId}/category", restaurantId)
                .param("isVeg", "notABoolean"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(menuItemService);
    }
   
    @Test
    @DisplayName("should return 200 OK with list of unique restaurant IDs for similar item name search")
    void getMenuItemsBySimilarName_Success() throws Exception {
        String searchName = "burger";
        List<Long> mockRestaurantIds = Arrays.asList(101L, 102L);

        when(menuItemService.getMenuItemsBySimilarName(searchName)).thenReturn(mockRestaurantIds);

        mockMvc.perform(get("/api/v1/menu/search")
                .param("itemName", searchName))
                .andExpect(status().isOk())
                .andExpected(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0]").value(101L))
                .andExpect(jsonPath("$[1]").value(102L));

        verify(menuItemService, times(1)).getMenuItemsBySimilarName(searchName);
    }
    
    @Test
    @DisplayName("should return 404 Not Found when no items match similar name search")
    void getMenuItemsBySimilarName_NoItemsFound() throws Exception {
        String searchName = "nonexistent";

        when(menuItemService.getMenuItemsBySimilarName(searchName))
                .thenThrow(new NoItemsInRestaurantException(AppConstants.NO_SIMILAR_ITEMS_FOUND + searchName));

        mockMvc.perform(get("/api/v1/menu/search")
                .param("itemName", searchName))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpect(jsonPath("$.message").value(AppConstants.NO_SIMILAR_ITEMS_FOUND + searchName));

        verify(menuItemService, times(1)).getMenuItemsBySimilarName(searchName);
    }
    
    @Test
    @DisplayName("should return 400 Bad Request when item name is blank for similar name search")
    void getMenuItemsBySimilarName_BlankItemName() throws Exception {
        String searchName = "   "; 

        mockMvc.perform(get("/api/v1/menu/search")
                .param("itemName", searchName))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.itemName").value("Item name cannot be blank for search."));

        verifyNoInteractions(menuItemService);
    }
    
    @Test
    @DisplayName("should return 400 Bad Request when item name query parameter is missing for similar name search")
    void getMenuItemsBySimilarName_MissingItemNameParam() throws Exception {
        mockMvc.perform(get("/api/v1/menu/search"))
                .andExpect(status().isBadRequest());
        
        verifyNoInteractions(menuItemService);
    }
} 