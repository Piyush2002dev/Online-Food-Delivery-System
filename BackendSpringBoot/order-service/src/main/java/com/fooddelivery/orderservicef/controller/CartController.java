package com.fooddelivery.orderservicef.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.orderservicef.dto.CartDTO;
import com.fooddelivery.orderservicef.dto.CartItemDTO;
import com.fooddelivery.orderservicef.model.Cart;
import com.fooddelivery.orderservicef.service.CartServiceImpl;

@Slf4j
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartServiceImpl cartServiceImpl;
    
    /** 
     * Creating a Cart to the user
     * returns the created cart
     * */
    @GetMapping
    public ResponseEntity<CartDTO> getCart(
    		@RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {
    	
    	//long stronVal = 123456789L;
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
       		

        log.info("cart created");
        return ResponseEntity.ok(cartServiceImpl.getCartByUserId(Long.valueOf(requestId)));
        
        		
    }
    
    /** 
     * adding items to the cart
     * inputs the request body of CartItemDTO
     * returns the created cart with item
     * */
    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItemToCart(@RequestBody CartItemDTO cartItemDTO,
    		@RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {


    	//long stronVal = 123456789L;
        		
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    	
        log.info("item added to cart");
        return ResponseEntity.ok(cartServiceImpl.addItemToCart(Long.valueOf(requestId), cartItemDTO));
        		
    }
    
    /** 
     * updating the existing items in the cart
     * inputs the request body of CartItemDTO
     * uses the path variable itemId
     * returns the whole cart with the updated value of item 
     * */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable Long itemId,
            @RequestBody CartItemDTO cartItemDTO,
            @RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {


    	//long stronVal = 123456789L;
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    	

        CartDTO updatedCart = cartServiceImpl.updateCartItem(Long.valueOf(requestId), itemId, cartItemDTO);
        log.info("cart item updated !");
        return ResponseEntity.ok(updatedCart);
    }
    
    /** 
     * deleting the existing items in the cart
     * uses the path variable itemId
     * returns the cart after the removal of the item
     * */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeItemFromCart(
            @PathVariable Long itemId,
            @RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {


    	//long stronVal = 123456789L;
    	
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    	log.info("item deleted from cart successfully !");
    	 cartServiceImpl.removeItemFromCart(Long.valueOf(requestId), itemId);
    	 CartDTO updatedCart=cartServiceImpl.getCartByUserId(Long.valueOf(requestId));
        return ResponseEntity.ok(updatedCart);
    }
    
    /** 
     * deleting the existing  cart
     * returns a string indicating the cart is empty !
     * */
    @DeleteMapping
    public ResponseEntity<String> clearCart(
    		@RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {
    	
    	//long stronVal = 123456789L;
    	
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    	
    	cartServiceImpl.clearCart(Long.valueOf(requestId));
    	log.info("cart emptied succesfully !");
        return ( ResponseEntity.ok("Cart is empty"));
    }
}
