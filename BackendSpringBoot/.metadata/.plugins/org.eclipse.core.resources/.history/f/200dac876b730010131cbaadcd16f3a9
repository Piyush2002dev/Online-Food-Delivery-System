package com.fooddelivery.orderservicef.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fooddelivery.orderservicef.dto.*;
import com.fooddelivery.orderservicef.exception.InvalidOperationException;
import com.fooddelivery.orderservicef.exception.ResourceNotFoundException;
import com.fooddelivery.orderservicef.model.*;
import com.fooddelivery.orderservicef.repository.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private CartServiceImpl cartServiceImpl;
    @Mock private PaymentServiceClient paymentServiceClient;
    @Mock private RestaurantServiceClient restaurantServiceClient;
    @Mock private AgentServiceClient agentServiceClient;

    @InjectMocks private OrderServiceImpl orderService;

    private Long userId;
    private Long restaurantId;
    private Long orderId;
    private CartDTO cartDTO;
    private OrderRequestDTO requestDTO;
    private Order order;
    private OrderItem orderItem;

    @BeforeEach
    void setUp() {
        userId = 1L;
        restaurantId = 2L;
        orderId = 3L;
        
        // Setup CartDTO
        cartDTO = new CartDTO();
        cartDTO.setId(1L);
        cartDTO.setUserId(userId);
        cartDTO.setRestaurantId(restaurantId);
        cartDTO.setItems(Arrays.asList(
            new CartItemDTO(1L, 101L, "Pizza", 2, 150.0),
            new CartItemDTO(2L, 102L, "Burger", 1, 100.0)
        ));
        
        // Setup OrderRequestDTO
        requestDTO = new OrderRequestDTO();
        requestDTO.setUserId(userId);
        requestDTO.setRestaurantId(restaurantId);
        requestDTO.setDeliveryAddress("123 Street");
        
        // Setup OrderItem
        orderItem = new OrderItem();
        orderItem.setId(1L);
        orderItem.setMenuItemId(101L);
        orderItem.setItemName("Pizza");
        orderItem.setQuantity(2);
        orderItem.setPrice(150.0);
        
        // Setup Order
        order = Order.builder()
            .orderId(orderId)
            .userId(userId)
            .restaurantId(restaurantId)
            .deliveryAddress("123 Street")
            .orderTime(LocalDateTime.now())
            .status(OrderStatus.PENDING)
            .totalAmount(400.0)
            .idempotencyKey("test-key")
            .items(Arrays.asList(orderItem))
            .build();
        
        orderItem.setOrder(order);
    }

    @Test
    void testPlaceOrder_EmptyCart_ThrowsException() {
        // Given
        when(orderRepository.existsByIdempotencyKey(any())).thenReturn(false);
        cartDTO.setItems(new ArrayList<>());
        when(cartServiceImpl.getCartByUserId(userId)).thenReturn(cartDTO);

        // When & Then
        assertThrows(InvalidOperationException.class, () ->
            orderService.placeOrder(requestDTO, "key"));
    }

    @Test
    void testPlaceOrder_DuplicateIdempotencyKey_ReturnsExistingOrder() {
        // Given
        when(orderRepository.existsByIdempotencyKey("key")).thenReturn(true);
        when(orderRepository.findByidempotencyKey("key")).thenReturn(Optional.of(order));

        // When
        OrderDTO result = orderService.placeOrder(requestDTO, "key");

        // Then
        assertNotNull(result);
        assertEquals(orderId, result.getOrderId());
        verify(orderRepository).existsByIdempotencyKey("key");
        verify(orderRepository).findByidempotencyKey("key");
    }

    @Test
    void testPlaceOrder_SuccessfulOrder() {
        // Given
        when(orderRepository.existsByIdempotencyKey("key")).thenReturn(false);
        when(cartServiceImpl.getCartByUserId(userId)).thenReturn(cartDTO);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderItemRepository.saveAll(any())).thenReturn(Arrays.asList(orderItem));
        
        PaymentResponseDTO paymentResponse = new PaymentResponseDTO();
        paymentResponse.setPaymentId(123L);
        paymentResponse.setPaymentStatus("SUCCESS");
        when(paymentServiceClient.processPayment(any())).thenReturn(paymentResponse);
        
        doNothing().when(cartServiceImpl).clearCart(userId);

        // When
        OrderDTO result = orderService.placeOrder(requestDTO, "key");

        // Then
        assertNotNull(result);
        assertEquals(orderId, result.getOrderId());
        verify(orderRepository, times(2)).save(any(Order.class));
        verify(paymentServiceClient).processPayment(any());
        verify(cartServiceImpl).clearCart(userId);
    }

    @Test
    void testPlaceOrder_PaymentFailure_ThrowsException() {
        // Given
        when(orderRepository.existsByIdempotencyKey("key")).thenReturn(false);
        when(cartServiceImpl.getCartByUserId(userId)).thenReturn(cartDTO);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderItemRepository.saveAll(any())).thenReturn(Arrays.asList(orderItem));
        when(paymentServiceClient.processPayment(any())).thenThrow(new RuntimeException("Payment failed"));

        // When & Then
        assertThrows(InvalidOperationException.class, () ->
            orderService.placeOrder(requestDTO, "key"));
    }

    @Test
    void testGetRestaurantOrders_ReturnsList() {
        // Given - Use the correct method signature
        when(orderRepository.findByRestaurantId(restaurantId))
            .thenReturn(Arrays.asList(order));

        // When - Use the correct method signature  
        List<OrderDTO> orders = orderService.getRestaurantOrders(restaurantId);

        // Then
        assertNotNull(orders);
        assertEquals(1, orders.size());
        assertEquals(restaurantId, orders.get(0).getRestaurantId());
    }

    @Test
    void testGetOrderDetails_Success() {
        // Given
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        // When
        OrderDTO result = orderService.getOrderDetails(orderId);

        // Then
        assertNotNull(result);
        assertEquals(orderId, result.getOrderId());
        assertEquals(userId, result.getUserId());
    }

    @Test
    void testGetOrderDetails_OrderNotFound_ThrowsException() {
        // Given
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () ->
            orderService.getOrderDetails(orderId));
    }

    @Test
    void testOrderExists_True() {
        // Given
        when(orderRepository.existsByIdempotencyKey("key")).thenReturn(true);

        // When
        boolean exists = orderService.orderExists("key");

        // Then
        assertTrue(exists);
    }

    @Test
    void testOrderExists_False() {
        // Given
        when(orderRepository.existsByIdempotencyKey("key")).thenReturn(false);

        // When
        boolean exists = orderService.orderExists("key");

        // Then
        assertFalse(exists);
    }

    @Test
    void testConvertToDTO_WithAllFields() {
        // Given
        order.setPaymentId(123L);
        order.setDeliveryAgentId(456L);
        order.setDeliveryTime(LocalDateTime.now().plusHours(1));

        // When
        OrderDTO result = orderService.convertToDTO(order);

        // Then
        assertNotNull(result);
        assertEquals(orderId, result.getOrderId());
        assertEquals(userId, result.getUserId());
        assertEquals(restaurantId, result.getRestaurantId());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(400.0, result.getTotalAmount());
        assertEquals("123 Street", result.getDeliveryAddress());
        assertEquals(123L, result.getPaymentId());
        assertEquals(456L, result.getDeliveryAgentId());
        assertNotNull(result.getOrderTime());
        assertNotNull(result.getDeliveryTime());
        assertEquals(1, result.getItems().size());
    }
} 