package com.fooddelivery.orderservicef.service;

import com.fooddelivery.orderservicef.dto.CartDTO;
import com.fooddelivery.orderservicef.dto.CartItemDTO;
import com.fooddelivery.orderservicef.dto.MenuItemDTO;
import com.fooddelivery.orderservicef.exception.InvalidOperationException;
import com.fooddelivery.orderservicef.exception.ResourceNotFoundException;
import com.fooddelivery.orderservicef.model.Cart;
import com.fooddelivery.orderservicef.model.CartItem;
import com.fooddelivery.orderservicef.repository.CartItemRepository;
import com.fooddelivery.orderservicef.repository.CartRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @InjectMocks
    private CartServiceImpl cartService;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private MenuServiceClient menuServiceClient;

    @BeforeEach
    void setUp() {
        // Setup handled by @Mock annotations
    }

    @Test
    void testGetCartByUserId_CartExists() {
        Long userId = 123L;
        Cart cart = new Cart();
        cart.setId(1L);
        cart.setUserId(userId);
        cart.setRestaurantId(100L);
        cart.setItems(new ArrayList<>());

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        CartDTO result = cartService.getCartByUserId(userId);

        assertEquals(userId, result.getUserId());
        assertEquals(cart.getId(), result.getId());
        verify(cartRepository, times(1)).findByUserId(userId);
    }

    @Test
    void testGetCartByUserId_CartDoesNotExist() {
        Long userId = 123L;
        
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());

        CartDTO result = cartService.getCartByUserId(userId);

        // Should return empty cart DTO for non-existent cart
        assertEquals(userId, result.getUserId());
        assertTrue(result.getItems().isEmpty());
        verify(cartRepository, times(1)).findByUserId(userId);
    }

    @Test
    void testAddItemToCart_InvalidQuantity() {
        Long userId = 123L;

        CartItemDTO itemDTO = new CartItemDTO();
        itemDTO.setMenuItemId(1L);
        itemDTO.setItemName("Pizza");
        itemDTO.setQuantity(0);  // Invalid quantity
        itemDTO.setPrice(10.0);

        assertThrows(InvalidOperationException.class, () -> cartService.addItemToCart(userId, itemDTO));
    }

    @Test
    void testAddItemToCart_MenuItemNotFound() {
        Long userId = 123L;
        Long menuItemId = 999L;

        CartItemDTO itemDTO = new CartItemDTO();
        itemDTO.setMenuItemId(menuItemId);
        itemDTO.setItemName("Pizza");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(15.50);

        when(menuServiceClient.getMenuItemById(menuItemId)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> cartService.addItemToCart(userId, itemDTO));
    }

    @Test
    void testAddItemToCart_NewCart() {
        Long userId = 123L;
        Long menuItemId = 1L;

        CartItemDTO itemDTO = new CartItemDTO();
        itemDTO.setMenuItemId(menuItemId);
        itemDTO.setItemName("Pizza");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(15.50);

        MenuItemDTO menuItemDTO = new MenuItemDTO();
        menuItemDTO.setItemName("Pizza");
        menuItemDTO.setPrice(15.50);
        menuItemDTO.setIsAvailable(true);
        menuItemDTO.setRestaurantId(100L);

        Cart newCart = new Cart();
        newCart.setId(1L);
        newCart.setUserId(userId);
        newCart.setRestaurantId(100L);
        newCart.setItems(new ArrayList<>());

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(menuServiceClient.getMenuItemById(menuItemId)).thenReturn(menuItemDTO);
        when(cartRepository.save(any(Cart.class))).thenReturn(newCart);
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CartDTO result = cartService.addItemToCart(userId, itemDTO);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        verify(cartRepository, times(2)).save(any(Cart.class)); // Once for creating cart, once for updating
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void testClearCart_Success() {
        Long userId = 123L;

        Cart cart = new Cart();
        cart.setId(1L);
        cart.setUserId(userId);
        cart.setRestaurantId(100L);

        CartItem item1 = new CartItem();
        item1.setId(1L);
        item1.setMenuItemId(1L);
        item1.setItemName("Pizza");
        item1.setQuantity(2);
        item1.setPrice(15.50);

        List<CartItem> cartItems = Arrays.asList(item1);
        cart.setItems(cartItems);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        cartService.clearCart(userId);

        verify(cartItemRepository, times(1)).deleteAll(cartItems);
        verify(cartRepository, times(1)).delete(cart);
    }

    @Test
    void testClearCart_CartNotFound() {
        Long userId = 123L;

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> cartService.clearCart(userId));
        verify(cartRepository, times(1)).findByUserId(userId);
        verify(cartItemRepository, never()).deleteAll(any());
    }
} 
