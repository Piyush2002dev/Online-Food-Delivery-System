package com.fooddelivery.orderservicef.service;
import java.util.UUID;

import com.fooddelivery.orderservicef.dto.CartDTO;
import com.fooddelivery.orderservicef.dto.CartItemDTO;

public interface CartService {
    CartDTO getCartByUserId(Long userId);
    CartDTO addItemToCart(Long userId, CartItemDTO cartItemDTO);
    CartDTO updateCartItem(Long userId, Long itemId, CartItemDTO cartItemDTO);
    void removeItemFromCart(Long userId, Long itemId);
    void clearCart(Long userId);
}
