package com.fooddelivery.orderservicef.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.orderservicef.dto.OrderDTO;
import com.fooddelivery.orderservicef.dto.OrderRequestDTO;
import com.fooddelivery.orderservicef.dto.OrderStatusUpdateDTO;
import com.fooddelivery.orderservicef.model.OrderStatus;
import com.fooddelivery.orderservicef.service.OrderServiceImpl;
import com.fooddelivery.orderservicef.exception.ResourceNotFoundException;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceImpl orderServiceImpl;
   
    /** 
     * takes in the OrderDTO
     * places the order and returns the OrderEntity 
     * */
    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @RequestBody OrderRequestDTO orderRequest,
            @RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {

    	//long stronVal = 123456789L;
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        orderRequest.setUserId(Long.valueOf(requestId));


        log.info("Order placed successfully !"+idempotencyKey);
        return ResponseEntity.ok(
                orderServiceImpl.placeOrder(orderRequest, idempotencyKey)
            );
    }
    
    /** 
     * Retrieving the orders by user 
     * gets the user id by the jwt header 
     * returns the orders of the user 
     * */
    @GetMapping("/user")
    public ResponseEntity<List<OrderDTO>> getUserOrders(
    		@RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {
    	
    	
//    	long stronVal = 123456789L;
    	if (!roles.contains("CUSTOMER")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    	
        log.info("User "+Long.valueOf(requestId)+"Orders reteirved successfully !");
        return ResponseEntity.ok(orderServiceImpl.getUserOrders(Long.valueOf(requestId)));
    }
    
    /** 
     * Retrieving the orders by restaurant 
     * gets the restaurant id by the jwt header 
     * returns the orders placed the restaurant 
     * */
    @GetMapping("/restaurant")
    public ResponseEntity<List<OrderDTO>> getRestaurantOrders(
    		@RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {
    	
    	
    	//long stronVal = 5965392056977236797L;
    	if (!roles.contains("RESTAURANT")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    	
        log.info("Restaurant " +Long.valueOf(requestId)+"Orders reteirved successfully !");
        return ResponseEntity.ok(orderServiceImpl.getRestaurantOrders(Long.valueOf(requestId)));
    }
    
    /** 
     * Updating the status of the order
     * intakes the OrderStatusUpdateDTO
     * returns the updated order status by the restaurant 
     * */
    @PutMapping("/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @RequestBody OrderStatusUpdateDTO statusUpdateDTO,
            @RequestHeader("X-Internal-User-Id") String requestId,
			@RequestHeader("X-Internal-User-Roles")String roles) {
    	
//    	Long restId=5965392056977236797L;
    	if (!roles.contains("RESTAURANT")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    	
    	statusUpdateDTO.setRestaurantId(Long.valueOf(requestId));
        log.info("Orders status updated successfully !");
        return ResponseEntity.ok(
                orderServiceImpl.updateOrderStatus(statusUpdateDTO)
            );
    }
    
    /** 
     * Retrieving the order by it's id 
     * uses the orderId from PathVariable !
     * */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderDetails(
            @PathVariable Long orderId) {
    	log.info("Orders details retrieved successfully !");
        return ResponseEntity.ok(orderServiceImpl.getOrderDetails(orderId));
    }

    /** 
     * Deleting an order by its id 
     * Only allows deletion of COMPLETED or CANCELLED orders
     * Verifies the order belongs to the requesting restaurant
     * */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long orderId,
            @RequestHeader("X-Internal-User-Id") String requestId,
            @RequestHeader("X-Internal-User-Roles") String roles) {
        
        log.info("=== DELETE ORDER REQUEST RECEIVED ===");
        log.info("Order ID: {}", orderId);
        log.info("Request User ID: {}", requestId);
        log.info("User Roles: {}", roles);
        log.info("Request URL: /api/orders/{}", orderId);
        
        if (!roles.contains("RESTAURANT")) {
            log.error("Access denied - User does not have RESTAURANT role. Roles: {}", roles);
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        
        log.info("Role validation passed - User has RESTAURANT role");
        
        try {
            log.info("Calling orderServiceImpl.deleteOrder with orderId: {} and restaurantId: {}", orderId, requestId);
            orderServiceImpl.deleteOrder(orderId, Long.valueOf(requestId));
            log.info("Order {} deleted successfully by restaurant {}", orderId, requestId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            log.error("Order not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Delete operation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Unexpected error during delete operation: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
