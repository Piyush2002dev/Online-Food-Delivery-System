package com.fooddelivery.orderservicef.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fooddelivery.orderservicef.config.SecurityConfig;
import com.fooddelivery.orderservicef.dto.OrderDTO;
import com.fooddelivery.orderservicef.dto.OrderRequestDTO;
import com.fooddelivery.orderservicef.dto.OrderStatusUpdateDTO;
import com.fooddelivery.orderservicef.model.OrderStatus;
import com.fooddelivery.orderservicef.service.OrderServiceImpl;

@WebMvcTest(OrderController.class)
@Import(SecurityConfig.class) // if you have a custom config
@AutoConfigureMockMvc(addFilters = false) // disables security filters
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderServiceImpl orderService;

    @Autowired
    private ObjectMapper objectMapper;

    private final Long userId = 123456789L;
    private final Long restaurantId = 5965392056977236797L;

    OrderDTO createSampleOrderDTO() {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(1L);
        dto.setUserId(userId);
        dto.setRestaurantId(restaurantId);
        dto.setStatus(OrderStatus.PENDING);
        dto.setTotalAmount(10.0);
        dto.setOrderTime(LocalDateTime.now());
        dto.setDeliveryAddress("123 Main St");
        return dto;
    }
    
    @Test
    void testPlaceOrder() throws Exception {
        OrderRequestDTO requestDTO = new OrderRequestDTO();
        requestDTO.setUserId(userId); // Will be overwritten by controller
        requestDTO.setRestaurantId(restaurantId);
        requestDTO.setDeliveryAddress("123 Main St");

        OrderDTO responseDTO = createSampleOrderDTO();

        Mockito.when(orderService.placeOrder(any(OrderRequestDTO.class), eq("unique-key")))
                .thenReturn(responseDTO);

        mockMvc.perform(post("/api/orders")
                        .header("Idempotency-Key", "unique-key")
                        .header("X-Internal-User-Id", String.valueOf(userId))
                        .header("X-Internal-User-Roles", "CUSTOMER")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId));
    }

    @Test
    void testGetUserOrders() throws Exception {
        Mockito.when(orderService.getUserOrders(userId))
                .thenReturn(List.of(createSampleOrderDTO()));

        mockMvc.perform(get("/api/orders/user")
                        .header("X-Internal-User-Id", String.valueOf(userId))
                        .header("X-Internal-User-Roles", "CUSTOMER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(userId));
    }

    @Test
    void testGetRestaurantOrders() throws Exception {
        Mockito.when(orderService.getRestaurantOrders(restaurantId, OrderStatus.PENDING))
                .thenReturn(List.of(createSampleOrderDTO()));

        mockMvc.perform(get("/api/orders/restaurant")
                        .header("X-Internal-User-Id", String.valueOf(restaurantId))
                        .header("X-Internal-User-Roles", "RESTAURANT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(userId));
    }

    @Test
    void testUpdateOrderStatus() throws Exception {
        OrderStatusUpdateDTO updateDTO = new OrderStatusUpdateDTO();
        updateDTO.setOrderId(1L);
        updateDTO.setRestaurantId(restaurantId); // Will be overwritten by controller
        updateDTO.setStatus(OrderStatus.ACCEPTED);

        OrderDTO responseDTO = createSampleOrderDTO();
        responseDTO.setStatus(OrderStatus.ACCEPTED);

        Mockito.when(orderService.updateOrderStatus(any(OrderStatusUpdateDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(put("/api/orders/status")
                        .header("X-Internal-User-Id", String.valueOf(restaurantId))
                        .header("X-Internal-User-Roles", "RESTAURANT")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
    }

    @Test
    void testGetOrderDetails() throws Exception {
        Long orderId = 1L;
        OrderDTO responseDTO = createSampleOrderDTO();
        responseDTO.setOrderId(orderId);

        Mockito.when(orderService.getOrderDetails(orderId)).thenReturn(responseDTO);

        mockMvc.perform(get("/api/orders/" + orderId)
                        // No auth required for this endpoint
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(orderId));
    }
}