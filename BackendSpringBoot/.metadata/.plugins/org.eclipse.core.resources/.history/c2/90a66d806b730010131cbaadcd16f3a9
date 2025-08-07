package com.ofds.menu.service;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.ofds.menu.dto.MenuItemRequestDto;
import com.ofds.menu.dto.MenuItemResponseDto;
import com.ofds.menu.dto.ResponseMessageDto;
import com.ofds.menu.entity.MenuItem;
import com.ofds.menu.exception.DuplicateMenuItemException;
import com.ofds.menu.exception.InvalidCategoryException;
import com.ofds.menu.exception.InvalidItemIdException;
import com.ofds.menu.exception.InvalidItemNameException;
import com.ofds.menu.exception.InvalidRestaurantIdException;
import com.ofds.menu.exception.MenuItemNotFoundException;
import com.ofds.menu.exception.NoItemsInRestaurantException;
import com.ofds.menu.mapper.MenuItemMapper;
import com.ofds.menu.repository.MenuItemRepository;
import com.ofds.menu.util.AppConstants;

@ExtendWith(MockitoExtension.class)
 class MenuItemServiceImplTest {
	
	@Mock
	private MenuItemRepository menuItemRepository;
	@Mock
	private MenuItemMapper menuItemMapper;
	@InjectMocks
	private MenuItemServiceImpl menuItemServiceImpl;
	
	private MenuItemRequestDto menuItemRequestDto;
	private MenuItem menuItem;
	private MenuItemResponseDto menuItemResponseDto;
	
	@BeforeEach
	void setUp(){
		
		//Initialize sample data for each test
		menuItemRequestDto = new MenuItemRequestDto(
				"Pizza","Delicious cheese pizza",12.99,true);
		menuItem = new MenuItem(
				101L,1L,"Pizza","Delicious cheese pizza",true,12.99,null,null,null,null);
		menuItemResponseDto = new MenuItemResponseDto(
				"Pizza","Delicious cheese pizza", 12.99,true);
	}

	@Test
	@DisplayName("Should create a new menu item successfully")
	void createMenuItem_Success(){
		Long restaurantId = 1L;
		when(menuItemRepository.findByRestaurantIdAndItemName(restaurantId, menuItemRequestDto.getItemName()))
		.thenReturn(Optional.empty());
		when(menuItemMapper.convertToEntity(menuItemRequestDto)).thenReturn(menuItem);
		when(menuItemRepository.save(any(MenuItem.class))).thenReturn(menuItem);
		
		ResponseMessageDto response = menuItemServiceImpl.createMenuItem(restaurantId, menuItemRequestDto);
		
		
		assertNotNull(response);
		assertEquals(AppConstants.ITEM_ADDED, response.getMessage());
		verify(menuItemRepository, times(1)).findByRestaurantIdAndItemName(restaurantId, menuItemRequestDto.getItemName());
		verify(menuItemMapper, times(1)).convertToEntity(menuItemRequestDto);
		verify(menuItemRepository, times(1)).save(any(MenuItem.class));
		
	}
	
	@Test
    @DisplayName("should throw InvalidRestaurantIdException when restaurant ID is null")
	void createMenuItem_InvalidRestaurant_IdNull() {
		Long restaurantId = null;
		
		InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class, () -> menuItemServiceImpl.createMenuItem(restaurantId, menuItemRequestDto));
		
		assertEquals(AppConstants.INVALID_RESTAURANTID+restaurantId, thrown.getMessage());
		verifyNoInteractions(menuItemRepository, menuItemMapper);
		
	}
	
	@Test
    @DisplayName("should throw InvalidRestaurantIdException when restaurant ID is Zero")
	void createMenuItem_InvalidRestaurantId_Zreo() {
		
		Long restaurantId = 0L;
		
		InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class, () -> menuItemServiceImpl.createMenuItem(restaurantId, menuItemRequestDto));
		
		assertEquals(AppConstants.INVALID_RESTAURANTID+restaurantId, thrown.getMessage());
		verifyNoInteractions(menuItemRepository, menuItemMapper);
	}
	
	@Test
    @DisplayName("should throw InvalidRestaurantIdException when restaurant ID is Negative")
	void createMenuItem_InvalidRestaurantId_Negative() {
		
		Long restaurantId = -5L;
		
		InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class, () -> menuItemServiceImpl.createMenuItem(restaurantId, menuItemRequestDto));
		
		assertEquals(AppConstants.INVALID_RESTAURANTID+restaurantId, thrown.getMessage());
		verifyNoInteractions(menuItemRepository, menuItemMapper);
	}

	@Test
	@DisplayName("should throw DuplicateMenuItemException if item with same name already exists in restaurant")
	void createMenuItem_DuplicateItem() {
		
		Long restaurantId = 1L;
		
		when(menuItemRepository.findByRestaurantIdAndItemName(restaurantId, menuItemRequestDto.getItemName()))
		.thenReturn(Optional.of(menuItem));
		
		DuplicateMenuItemException thrown = assertThrows(DuplicateMenuItemException.class, () -> menuItemServiceImpl.createMenuItem(restaurantId, menuItemRequestDto));
		
		assertEquals(AppConstants.DUPLICATE_ITEM+menuItemRequestDto.getItemName(), thrown.getMessage());
		verify(menuItemRepository, times(1)).findByRestaurantIdAndItemName(restaurantId, menuItemRequestDto.getItemName());
		verifyNoMoreInteractions(menuItemRepository);
		verifyNoInteractions(menuItemMapper);
	}

	@Test
    @DisplayName("should update an existing menu item successfully")
    void updateMenuItem_Success() {
		
        Long itemId = 101L;
        when(menuItemRepository.findById(itemId)).thenReturn(Optional.of(menuItem));
        doNothing().when(menuItemMapper).updateEntityFromDto(menuItemRequestDto, menuItem);
        when(menuItemRepository.save(menuItem)).thenReturn(menuItem);


        ResponseMessageDto response = menuItemServiceImpl.updateMenuItem(itemId, menuItemRequestDto);

        assertNotNull(response);
        assertEquals(AppConstants.ITEM_UPDATED, response.getMessage());
        verify(menuItemRepository, times(1)).findById(itemId);
        verify(menuItemMapper, times(1)).updateEntityFromDto(menuItemRequestDto, menuItem);
        verify(menuItemRepository, times(1)).save(menuItem);
    }
	
	@Test
    @DisplayName("should throw MenuItemNotFoundException when deleting a non-existent item")
    void deleteMenuItem_NotFound() {

        Long itemId = 999L;
        when(menuItemRepository.findById(itemId)).thenReturn(Optional.empty());


        MenuItemNotFoundException thrown = assertThrows(MenuItemNotFoundException.class, () -> menuItemServiceImpl.deleteMenuItem(itemId));

        assertEquals(AppConstants.ITEM_NOTFOUND + itemId, thrown.getMessage());
        verify(menuItemRepository, times(1)).findById(itemId);
        verifyNoMoreInteractions(menuItemRepository);
    }
	
	@Test
    @DisplayName("should retrieve a menu item by ID successfully")
    void getMenuItemById_Success() {

        Long itemId = 101L;
        when(menuItemRepository.findById(itemId)).thenReturn(Optional.of(menuItem));
        when(menuItemMapper.convertToDo(menuItem)).thenReturn(menuItemResponseDto);

        MenuItemResponseDto response = menuItemServiceImpl.getMenuItemById(itemId);

        assertNotNull(response);
        assertEquals(menuItemResponseDto.getItemName(), response.getItemName());
        verify(menuItemRepository, times(1)).findById(itemId);
        verify(menuItemMapper, times(1)).convertToDo(menuItem);
    }
	
    @Test
    @DisplayName("should throw InvalidItemIdException when item ID is null")
    void getMenuItemById_InvalidItemId_Null() {

        Long itemId = null;


        InvalidItemIdException thrown = assertThrows(InvalidItemIdException.class, () -> menuItemServiceImpl.getMenuItemById(itemId));

        assertEquals(AppConstants.INVALID_ITEMID + itemId, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
    }
    
    @Test
    @DisplayName("should throw InvalidItemIdException when item ID is zero")
    void getMenuItemById_InvalidItemId_Zero() {
    	
    	Long itemId = 0L;

        InvalidItemIdException thrown = assertThrows(InvalidItemIdException.class, () -> menuItemServiceImpl.getMenuItemById(itemId));

        assertEquals(AppConstants.INVALID_ITEMID + itemId, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
    }

    @Test
    @DisplayName("should throw InvalidItemIdException when item ID is negative")
    void getMenuItemById_InvalidItemId_Negative() {

    	Long itemId = -5L;
        
    	InvalidItemIdException thrown = assertThrows(InvalidItemIdException.class, () -> menuItemServiceImpl.getMenuItemById(itemId));

        assertEquals(AppConstants.INVALID_ITEMID + itemId, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
    }
	
    @Test
    @DisplayName("should throw MenuItemNotFoundException when retrieving a non-existent item")
    void getMenuItemById_NotFound() {

        Long itemId = 999L;
        when(menuItemRepository.findById(itemId)).thenReturn(Optional.empty());

        MenuItemNotFoundException thrown = assertThrows(MenuItemNotFoundException.class, () -> menuItemServiceImpl.getMenuItemById(itemId));

        assertEquals(AppConstants.ITEM_NOTFOUND + itemId, thrown.getMessage());
        verify(menuItemRepository, times(1)).findById(itemId);
        verifyNoInteractions(menuItemMapper);
    }
    
    @Test
    @DisplayName("should retrieve all menu items for a restaurant successfully")
    void getAllMenuItemsByResturant_Success() {

        Long restaurantId = 1L;
        List<MenuItem> menuItems = Arrays.asList(menuItem, new MenuItem(
            102L, 1L, "Burger", "Classic beef burger", false,8.50, null, null, null, null
        ));
        
        List<MenuItemResponseDto> menuItemsResponse = Arrays.asList(menuItemResponseDto, new MenuItemResponseDto("Burger", "Classic beef burger", 8.50, false));

        when(menuItemRepository.findByRestaurantId(restaurantId)).thenReturn(menuItems);
        when(menuItemMapper.convertToDo(any(MenuItem.class))).thenReturn(menuItemsResponse.get(0), menuItemsResponse.get(1));

        List<MenuItemResponseDto> responseList = menuItemServiceImpl.getAllMenuItemsByResturant(restaurantId);

        assertNotNull(responseList);
        assertFalse(responseList.isEmpty());
        assertEquals(2, responseList.size());
        assertEquals("Pizza", responseList.get(0).getItemName());
        assertEquals("Burger", responseList.get(1).getItemName());
        verify(menuItemRepository, times(1)).findByRestaurantId(restaurantId);
        verify(menuItemMapper, times(2)).convertToDo(any(MenuItem.class));
    }
    
    @Test
    @DisplayName("should throw InvalidRestaurantIdException when restaurant ID is null for getting all menu items")
    void getAllMenuItemsByResturant_InvalidRestaurantId_Null() {

        Long restaurantId = null;

        InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class, () -> menuItemServiceImpl.getAllMenuItemsByResturant(restaurantId));

        assertEquals(AppConstants.INVALID_RESTAURANTID + restaurantId, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
    }
    
    @Test
    @DisplayName("should throw InvalidRestaurantIdException when restaurant ID is zero for getting all menu items")
    void getAllMenuItemsByResturant_InvalidRestaurantId_Zero() {

        Long restaurantId = 0L;

        InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class, () -> menuItemServiceImpl.getAllMenuItemsByResturant(restaurantId));

        assertEquals(AppConstants.INVALID_RESTAURANTID + restaurantId, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
       
    }
    
    @Test
    @DisplayName("should throw InvalidRestaurantIdException when restaurant ID is negative for getting all menu items")
    void getAllMenuItemsByResturant_InvalidRestaurantId_Negative() {
    	Long restaurantId = -5L;
    	InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class, () -> menuItemServiceImpl.getAllMenuItemsByResturant(restaurantId));

        assertEquals(AppConstants.INVALID_RESTAURANTID + restaurantId, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
    }

    @Test
    @DisplayName("should throw NoItemsInRestaurantException when no menu items are found for a restaurant")
    void getAllMenuItemsByResturant_NoItemsFound() {

        Long restaurantId = 1L;
        when(menuItemRepository.findByRestaurantId(restaurantId)).thenReturn(Collections.emptyList());
    
        NoItemsInRestaurantException thrown = assertThrows(NoItemsInRestaurantException.class, () -> menuItemServiceImpl.getAllMenuItemsByResturant(restaurantId));

        assertEquals(AppConstants.NOITEMS_IN_RESTAURANT + restaurantId, thrown.getMessage());
        verify(menuItemRepository, times(1)).findByRestaurantId(restaurantId);
        verifyNoInteractions(menuItemMapper);
    }
    
	// --- NEW TESTS FOR getMenuItemsByRestaurantAndCategory ---	
    
    @Test
	@DisplayName("should retrieve vegetarian menu items for a restaurant successfully")

	void getMenuItemsByRestaurantAndCategory_Vegetarian_Success() {

		Long restaurantId = 101L;

		Boolean isVegetarian = true;

		MenuItem vegMenuItem = new MenuItem(2L, 101L, "Veggie Burger", "A tasty veggie burger", true, 10.00, null, null, null, null);

		MenuItemResponseDto vegMenuItemResponseDto = new MenuItemResponseDto("Veggie Burger", "A tasty veggie burger", 10.00, true);

		List<MenuItem> menuItems = Collections.singletonList(vegMenuItem);

		List<MenuItemResponseDto> expectedResponse = Collections.singletonList(vegMenuItemResponseDto);

		when(menuItemRepository.findByRestaurantIdAndIsVegetarian(restaurantId, isVegetarian)).thenReturn(menuItems);

		when(menuItemMapper.convertToDo(vegMenuItem)).thenReturn(vegMenuItemResponseDto);

		List<MenuItemResponseDto> response = menuItemServiceImpl.getMenuItemByCategory(restaurantId, isVegetarian);

		assertNotNull(response);

		assertFalse(response.isEmpty());

		assertEquals(expectedResponse.size(), response.size());

		assertEquals(expectedResponse.get(0), response.get(0));

		verify(menuItemRepository, times(1)).findByRestaurantIdAndIsVegetarian(restaurantId, isVegetarian);

		verify(menuItemMapper, times(1)).convertToDo(vegMenuItem);

	}

	@Test

	@DisplayName("should retrieve non-vegetarian menu items for a restaurant successfully")

	void getMenuItemsByRestaurantAndCategory_NonVegetarian_Success() {

		Long restaurantId = 101L;

		Boolean isVegetarian = false;

		MenuItem nonVegMenuItem = new MenuItem(3L, 101L, "Chicken Wings", "Spicy chicken wings", false, 14.50, null, null, null, null);

		MenuItemResponseDto nonVegMenuItemResponseDto = new MenuItemResponseDto("Chicken Wings", "Spicy chicken wings", 14.50, false);

		List<MenuItem> menuItems = Collections.singletonList(nonVegMenuItem);

		List<MenuItemResponseDto> expectedResponse = Collections.singletonList(nonVegMenuItemResponseDto);

		when(menuItemRepository.findByRestaurantIdAndIsVegetarian(restaurantId, isVegetarian)).thenReturn(menuItems);

		when(menuItemMapper.convertToDo(nonVegMenuItem)).thenReturn(nonVegMenuItemResponseDto);

		List<MenuItemResponseDto> response = menuItemServiceImpl.getMenuItemByCategory(restaurantId, isVegetarian);

		assertNotNull(response);

		assertFalse(response.isEmpty());

		assertEquals(expectedResponse.size(), response.size());

		assertEquals(expectedResponse.get(0), response.get(0));

		verify(menuItemRepository, times(1)).findByRestaurantIdAndIsVegetarian(restaurantId, isVegetarian);

		verify(menuItemMapper, times(1)).convertToDo(nonVegMenuItem);

	}

	@Test

	@DisplayName("should throw InvalidRestaurantIdException when restaurant ID is null on get by category")

	void getMenuItemsByRestaurantAndCategory_InvalidRestaurantId_Null() {

		Long restaurantId = null;

		Boolean isVegetarian = true;

		InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class,

															() -> menuItemServiceImpl.getMenuItemByCategory(restaurantId, isVegetarian));

		assertEquals(AppConstants.INVALID_RESTAURANTID + restaurantId, thrown.getMessage());

		verifyNoInteractions(menuItemRepository, menuItemMapper);

	}

	@Test

	@DisplayName("should throw InvalidRestaurantIdException when restaurant ID is zero on get by category")

	void getMenuItemsByRestaurantAndCategory_InvalidRestaurantId_Zero() {

		Long restaurantId = 0L;

		Boolean isVegetarian = false;

		InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class,

															() -> menuItemServiceImpl.getMenuItemByCategory(restaurantId, isVegetarian));

		assertEquals(AppConstants.INVALID_RESTAURANTID + restaurantId, thrown.getMessage());

		verifyNoInteractions(menuItemRepository, menuItemMapper);

	}

	@Test

	@DisplayName("should throw InvalidRestaurantIdException when restaurant ID is negative on get by category")

	void getMenuItemsByRestaurantAndCategory_InvalidRestaurantId_Negative() {

		Long restaurantId = -5L;

		Boolean isVegetarian = true;

		InvalidRestaurantIdException thrown = assertThrows(InvalidRestaurantIdException.class,

															() -> menuItemServiceImpl.getMenuItemByCategory(restaurantId, isVegetarian));

		assertEquals(AppConstants.INVALID_RESTAURANTID + restaurantId, thrown.getMessage());

		verifyNoInteractions(menuItemRepository, menuItemMapper);

	}

	@Test

	@DisplayName("should InvalidCategoryException throw  when isVegetarian is null on get by category")

	void getMenuItemsByRestaurantAndCategory_NullCategory() {

		Long restaurantId = 101L;

		Boolean isVegetarian = null;

		InvalidCategoryException thrown = assertThrows(InvalidCategoryException.class,

															() -> menuItemServiceImpl.getMenuItemByCategory(restaurantId, isVegetarian));

		assertEquals(AppConstants.INVALID_CATEGORY, thrown.getMessage());

		verifyNoInteractions(menuItemRepository, menuItemMapper);

	}

	@Test

	@DisplayName("should throw NoItemsInRestaurantException when no items are found for the specified category")

	void getMenuItemsByRestaurantAndCategory_NoItemsFound() {

		Long restaurantId = 101L;

		Boolean isVegetarian = true; 

		when(menuItemRepository.findByRestaurantIdAndIsVegetarian(restaurantId, isVegetarian))

				.thenReturn(Collections.emptyList());

		NoItemsInRestaurantException thrown = assertThrows(NoItemsInRestaurantException.class,

															() -> menuItemServiceImpl.getMenuItemByCategory(restaurantId, isVegetarian));

		assertEquals(AppConstants.NO_CATEGORY_ITEMS+restaurantId, thrown.getMessage());

		verify(menuItemRepository, times(1)).findByRestaurantIdAndIsVegetarian(restaurantId, isVegetarian);

		verifyNoInteractions(menuItemMapper);

	}
	
	@Test
    @DisplayName("should retrieve unique restaurant IDs by similar item name successfully")
    void getMenuItemsBySimilarName_Success() {
        String searchName = "pizza";
        MenuItem pizza1 = new MenuItem(1L, 101L, "Pepperoni Pizza", "desc", false, 15.0, null, null, null, null);
        MenuItem pizza2 = new MenuItem(2L, 102L, "Veggie Pizza", "desc", true, 14.0, null, null, null, null);
        MenuItem pizza3 = new MenuItem(3L, 101L, "Mushroom Pizza", "desc", true, 16.0, null, null, null, null);

        List<MenuItem> foundItems = Arrays.asList(pizza1, pizza2, pizza3);
        List<Long> expectedRestaurantIds = Arrays.asList(101L, 102L);

        when(menuItemRepository.findByItemNameContainingIgnoreCase(searchName)).thenReturn(foundItems);

        List<Long> result = menuItemServiceImpl.getMenuItemsBySimilarName(searchName);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
        assertTrue(result.containsAll(expectedRestaurantIds));
        assertEquals(expectedRestaurantIds.size(), result.size());

        verify(menuItemRepository, times(1)).findByItemNameContainingIgnoreCase(searchName);
        verifyNoInteractions(menuItemMapper);
    }
	
	@Test
    @DisplayName("should throw NoItemsInRestaurantException when no items found for similar name")
    void getMenuItemsBySimilarName_NoItemsFound() {
        String searchName = "nonexistent";

        when(menuItemRepository.findByItemNameContainingIgnoreCase(searchName)).thenReturn(Collections.emptyList());

        NoItemsInRestaurantException thrown = assertThrows(NoItemsInRestaurantException.class,
                () -> menuItemServiceImpl.getMenuItemsBySimilarName(searchName));

        assertEquals(AppConstants.NO_SIMILAR_ITEMS_FOUND + searchName, thrown.getMessage());
        verify(menuItemRepository, times(1)).findByItemNameContainingIgnoreCase(searchName);
        verifyNoInteractions(menuItemMapper);
    }
	
	@Test
    @DisplayName("should throw InvalidItemNameException when item name is null for similar name search")
    void getMenuItemsBySimilarName_NullItemName() {
        String searchName = null;

        InvalidItemNameException thrown = assertThrows(InvalidItemNameException.class,
                () -> menuItemServiceImpl.getMenuItemsBySimilarName(searchName));

        assertEquals(AppConstants.INVALID_ITEMNAME, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
    }
	
	@Test
    @DisplayName("should throw InvalidItemNameException when item name is blank for similar name search")
    void getMenuItemsBySimilarName_BlankItemName() {
        String searchName = "   ";

        InvalidItemNameException thrown = assertThrows(InvalidItemNameException.class,
                () -> menuItemServiceImpl.getMenuItemsBySimilarName(searchName));

        assertEquals(AppConstants.INVALID_ITEMNAME, thrown.getMessage());
        verifyNoInteractions(menuItemRepository, menuItemMapper);
    }
}
