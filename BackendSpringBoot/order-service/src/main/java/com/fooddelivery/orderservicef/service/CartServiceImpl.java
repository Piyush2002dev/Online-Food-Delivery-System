package com.fooddelivery.orderservicef.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fooddelivery.orderservicef.dto.CartDTO;
import com.fooddelivery.orderservicef.dto.CartItemDTO;
import com.fooddelivery.orderservicef.dto.MenuItemDTO;
import com.fooddelivery.orderservicef.exception.InvalidOperationException;
import com.fooddelivery.orderservicef.exception.ResourceNotFoundException;
import com.fooddelivery.orderservicef.model.Cart;
import com.fooddelivery.orderservicef.model.CartItem;
import com.fooddelivery.orderservicef.repository.CartItemRepository;
import com.fooddelivery.orderservicef.repository.CartRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuServiceClient menuServiceClient; // Assuming this is your Feign client for Menu service

    /**
     * Retrieves a user's cart. If no cart exists, returns an empty CartDTO.
     * This is crucial for the frontend to initialize the cart page.
     * @param userId The ID of the user.
     * @return CartDTO representing the user's cart, or an empty cart if not found.
     */
    @Transactional(readOnly = true)
    public CartDTO getCartByUserId(Long userId) {
        Optional<Cart> cartOptional = cartRepository.findByUserId(userId);
        if (cartOptional.isPresent()) {
            log.info("Cart found for user {}.", userId);
            return convertToDTO(cartOptional.get());
        } else {
            log.info("No cart found for user {}. Returning empty cart DTO.", userId);
            // Return an empty cart DTO if no cart exists, so frontend doesn't error
            CartDTO emptyCart = new CartDTO();
            emptyCart.setUserId(userId);
            emptyCart.setItems(new ArrayList<>());
            // Do NOT set a restaurantId if the cart doesn't exist/is empty on backend,
            // unless your frontend has a default empty cart restaurant concept.
            return emptyCart;
        }
    }

    /**
     * Adds a new item to the cart or updates the quantity of an existing item.
     * Handles cart creation if it doesn't exist, associating it with the restaurant of the first item.
     * Enforces single-restaurant carts.
     * @param userId The ID of the user.
     * @param cartItemDTO DTO containing menuItemId, quantity (and potentially itemName, price, though these are validated/fetched from MenuService).
     * @return Updated CartDTO.
     * @throws InvalidOperationException if quantity is less than 1 or item is from a different restaurant.
     * @throws ResourceNotFoundException if menu item not found.
     */
    @Transactional
    public CartDTO addItemToCart(Long userId, CartItemDTO cartItemDTO) {
        if (cartItemDTO.getQuantity() < 1) {
            throw new InvalidOperationException("Quantity must be at least 1.");
        }

        Long menuItemId = cartItemDTO.getMenuItemId();

        // 1. Fetch MenuItemDTO from Menu Service to get actual item details and restaurant ID
        MenuItemDTO menuItemDTO = menuServiceClient.getMenuItemById(menuItemId);
        if (menuItemDTO == null) {
            throw new ResourceNotFoundException("Menu item with ID " + menuItemId + " not found in the restaurant's menu.");
        }

        // 2. Find existing cart or create a new one
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    // *** CRUCIAL FIX: Set restaurantId when creating a new cart ***
                    newCart.setRestaurantId(menuItemDTO.getRestaurantId());
                    log.info("Creating new cart for user {} with restaurant ID {}.", userId, menuItemDTO.getRestaurantId());
                    return cartRepository.save(newCart); // Save the newly created cart with its restaurant ID
                });

        // 3. IMPORTANT: Enforce single-restaurant cart policy
        // If the cart already has a restaurant, check if the new item is from the same restaurant.
        // If the cart just got created, its restaurantId would be set from current item, so this check passes.
        if (cart.getRestaurantId() != null && !cart.getRestaurantId().equals(menuItemDTO.getRestaurantId())) {
            throw new InvalidOperationException("Cannot add items from a different restaurant. Please clear your current cart first or order from the same restaurant.");
        }

        // 4. Find existing CartItem for the MenuItem or create a new one
        Optional<CartItem> existingCartItemOptional = cart.getItems().stream()
                .filter(ci -> ci.getMenuItemId().equals(menuItemId))
                .findFirst();

        CartItem cartItem;
        if (existingCartItemOptional.isPresent()) {
            // Update existing item's quantity
            cartItem = existingCartItemOptional.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartItemDTO.getQuantity()); // Increment quantity
            log.info("Updated quantity for menu item {} in cart {}. New quantity: {}.", menuItemId, cart.getId(), cartItem.getQuantity());
        } else {
            // Add new item to cart
            cartItem = new CartItem();
            // It's safer to use data from MenuItemDTO for itemName and price for integrity
            cartItem.setMenuItemId(menuItemId);
            cartItem.setItemName(menuItemDTO.getItemName()); // Use name from MenuService for consistency
            cartItem.setPrice(menuItemDTO.getPrice());   // Use price from MenuService for consistency
            cartItem.setQuantity(cartItemDTO.getQuantity());
            cart.addCartItem(cartItem); // Use helper method to add and set cart reference
            log.info("Added new menu item {} to cart {}. Quantity: {}.", menuItemId, cart.getId(), cartItem.getQuantity());
        }

        // Save the updated/new cart item. CascadeType.ALL on Cart might save items automatically,
        // but explicit save here ensures it, especially for updates.
        cartItemRepository.save(cartItem);
        // Save the cart itself to ensure collection changes are persisted and if cart was new.
        cartRepository.save(cart);

        return convertToDTO(cart);
    }

    /**
     * Updates the quantity of a specific item in the user's cart.
     * @param userId The ID of the user.
     * @param menuItemId The ID of the menu item to update.
     * @param cartItemDTO DTO containing the new quantity.
     * @return Updated CartDTO.
     * @throws InvalidOperationException if quantity is less than 1.
     * @throws ResourceNotFoundException if cart or item not found.
     */
    @Transactional
    public CartDTO updateCartItem(Long userId, Long menuItemId, CartItemDTO cartItemDTO) {
        if (cartItemDTO.getQuantity() < 1) {
            // If quantity becomes 0, you might want to call removeItemFromCart instead.
            throw new InvalidOperationException("Quantity must be at least 1 for update operation. To remove, use delete endpoint.");
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user ID: " + userId));

        // Assuming menuItemId here is the ID of the menu item (product ID)
        CartItem itemToUpdate = cart.getItems().stream()
                .filter(cartItem -> cartItem.getMenuItemId().equals(menuItemId)) // Filter by menuItemId
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item with ID " + menuItemId + " not found in cart."));

        itemToUpdate.setQuantity(cartItemDTO.getQuantity());
        cartItemRepository.save(itemToUpdate); // Save the updated cart item
        log.info("Cart item updated successfully for menu item ID {} in cart {}. New quantity: {}.", menuItemId, cart.getId(), itemToUpdate.getQuantity());
        return convertToDTO(cart); // Convert the original cart (which now has updated item)
    }

    /**
     * Removes a specific item from the user's cart.
     * @param userId The ID of the user.
     * @param menuItemId The ID of the menu item to remove.
     * @throws ResourceNotFoundException if cart or item not found.
     */
    @Transactional
    public void removeItemFromCart(Long userId, Long menuItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user ID: " + userId));

        // Assuming menuItemId here is the ID of the menu item (product ID)
        CartItem itemToRemove = cart.getItems().stream()
                .filter(cartItem -> cartItem.getMenuItemId().equals(menuItemId)) // Filter by menuItemId
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item with ID " + menuItemId + " not found in cart."));

        cart.removeCartItem(itemToRemove); // Use helper method to remove and detach
        cartItemRepository.delete(itemToRemove); // Delete from the database
        log.info("Item with menu item ID {} deleted successfully from cart {}.", menuItemId, cart.getId());
        // No explicit cartRepository.save(cart) needed here due to orphanRemoval=true and CascadeType.ALL on Cart for 'items' collection.
        // However, if the cart becomes empty after removal and you want to also nullify the restaurantId, you'd need it.
        if (cart.getItems().isEmpty()) {
            cart.setRestaurantId(null); // Make sure restaurantId in Cart entity is nullable if you do this.
            cartRepository.save(cart); // Save cart to clear restaurantId
            log.info("Cart for user {} is now empty and restaurantId cleared.", userId);
        }
    }

    /**
     * Clears all items from the user's cart.
     * @param userId The ID of the user.
     * @throws ResourceNotFoundException if cart not found.
     */
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user ID: " + userId));

        cartItemRepository.deleteAll(cart.getItems()); // Delete all associated cart items
        cart.getItems().clear(); // Clear the collection
       // cart.setRestaurantId(null); // Important: Clear the restaurant ID when the cart is empty
        log.info("Cart for user {} cleared successfully! Restaurant ID also nulled.", userId);
        //cartRepository.save(cart); // Save the cart to reflect the cleared items and nullified restaurantId
        cartRepository.delete(cart);
    }

    // --- DTO Conversion Methods ---

    private CartDTO convertToDTO(Cart cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(cart.getUserId());
        cartDTO.setRestaurantId(cart.getRestaurantId());

        // You might want to fetch restaurant name/location here via MenuServiceClient
        // or a separate RestaurantService if you need it in the CartDTO response.
        // Example:
        // if (cart.getRestaurantId() != null) {
        //     RestaurantDTO restaurantDTO = menuServiceClient.getRestaurantById(cart.getRestaurantId());
        //     if (restaurantDTO != null) {
        //         cartDTO.setRestaurantName(restaurantDTO.getName());
        //         cartDTO.setRestaurantLocation(restaurantDTO.getLocation());
        //     }
        // }


        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        cartDTO.setItems(itemDTOs);

        return cartDTO;
    }

    private CartItemDTO convertToDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId()); // Crucial for frontend to uniquely identify cart items
        dto.setMenuItemId(cartItem.getMenuItemId());
        dto.setItemName(cartItem.getItemName());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getPrice());
        return dto;
    }

    // This method is now implicitly handled by addItemToCart's orElseGet.
    // It's removed to enforce that a cart is always created with a restaurantId.
    // @Transactional
    // public CartDTO getOrCreateCart(Long userId) {
    //     throw new UnsupportedOperationException("Use addItemToCart to create/get cart and associate with a restaurant.");
    // }
}