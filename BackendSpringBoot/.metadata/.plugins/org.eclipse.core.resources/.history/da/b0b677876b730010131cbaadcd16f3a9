package com.fooddelivery.orderservicef.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
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
import com.fooddelivery.orderservicef.dto.CartDTO;
import com.fooddelivery.orderservicef.dto.CartItemDTO;
import com.fooddelivery.orderservicef.service.CartServiceImpl;

@WebMvcTest(CartController.class)
@Import(SecurityConfig.class) // if you have a custom config
@AutoConfigureMockMvc(addFilters = false) // disables security filters
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartServiceImpl cartServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    private final Long userId = 123456789L;
    private final String USER_ID_HEADER = "X-Internal-User-Id";
    private final String USER_ROLES_HEADER = "X-Internal-User-Roles";
    private final String USER_ROLES_VALUE = "CUSTOMER";

    @Test
    void testGetCart() throws Exception {
        CartDTO cartDTO = new CartDTO(1L, userId, 1L, List.of());

        Mockito.when(cartServiceImpl.getCartByUserId(userId)).thenReturn(cartDTO);

        mockMvc.perform(get("/api/cart")
                .header(USER_ID_HEADER, userId.toString())
                .header(USER_ROLES_HEADER, USER_ROLES_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId));
    }

    @Test
    void testAddItemToCart() throws Exception {
        CartItemDTO itemDTO = new CartItemDTO(1L, 1L, "Pizza", 2, 10.0);
        CartDTO cartDTO = new CartDTO(1L, userId, 1L, List.of(itemDTO));

        Mockito.when(cartServiceImpl.addItemToCart(Mockito.eq(userId), Mockito.any())).thenReturn(cartDTO);

        mockMvc.perform(post("/api/cart/items")
                        .header(USER_ID_HEADER, userId.toString())
                        .header(USER_ROLES_HEADER, USER_ROLES_VALUE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(itemDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].itemName").value("Pizza"));
    }

    @Test
    void testUpdateCartItem() throws Exception {
        Long itemId = 1L;
        CartItemDTO itemDTO = new CartItemDTO(itemId, 1L, "Burger", 3, 15.0);
        CartDTO cartDTO = new CartDTO(1L, userId, 1L, List.of(itemDTO));

        Mockito.when(cartServiceImpl.updateCartItem(Mockito.eq(userId), Mockito.eq(itemId), Mockito.any())).thenReturn(cartDTO);

        mockMvc.perform(put("/api/cart/items/" + itemId)
                        .header(USER_ID_HEADER, userId.toString())
                        .header(USER_ROLES_HEADER, USER_ROLES_VALUE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(itemDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].itemName").value("Burger"));
    }

    @Test
    void testRemoveItemFromCart() throws Exception {
        Long itemId = 1L;
        CartDTO cartDTO = new CartDTO(1L, userId, 1L, List.of());

        Mockito.doNothing().when(cartServiceImpl).removeItemFromCart(userId, itemId);
        Mockito.when(cartServiceImpl.getCartByUserId(userId)).thenReturn(cartDTO);

        mockMvc.perform(delete("/api/cart/items/" + itemId)
                .header(USER_ID_HEADER, userId.toString())
                .header(USER_ROLES_HEADER, USER_ROLES_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void testClearCart() throws Exception {
        Mockito.doNothing().when(cartServiceImpl).clearCart(userId);

        mockMvc.perform(delete("/api/cart")
                .header(USER_ID_HEADER, userId.toString())
                .header(USER_ROLES_HEADER, USER_ROLES_VALUE))
                .andExpect(status().isOk())
                .andExpect(content().string("Cart is empty"));
    }
    
    @Test
    void testAddItemToCart_MissingBody() throws Exception {
        mockMvc.perform(post("/api/cart/items")
                .header(USER_ID_HEADER, userId.toString())
                .header(USER_ROLES_HEADER, USER_ROLES_VALUE)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateCartItem_MalformedId() throws Exception {
        CartItemDTO itemDTO = new CartItemDTO(1L, 1L, "Burger", 2, 10.0);

        mockMvc.perform(put("/api/cart/items/not-a-number")
                .header(USER_ID_HEADER, userId.toString())
                .header(USER_ROLES_HEADER, USER_ROLES_VALUE)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(itemDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRemoveItemFromCart_MalformedId() throws Exception {
        mockMvc.perform(delete("/api/cart/items/invalid-id")
                .header(USER_ID_HEADER, userId.toString())
                .header(USER_ROLES_HEADER, USER_ROLES_VALUE))
                .andExpect(status().isBadRequest());
    }
}