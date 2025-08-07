package com.fooddelivery.orderservicef.service;

import java.util.List;

import com.fooddelivery.orderservicef.dto.OrderDTO;
import com.fooddelivery.orderservicef.dto.OrderRequestDTO;
import com.fooddelivery.orderservicef.dto.OrderStatusUpdateDTO;
import com.fooddelivery.orderservicef.model.OrderStatus;

public interface OrderService {

    OrderDTO placeOrder(OrderRequestDTO request, String idempotencyKey);

    OrderDTO updateOrderStatus(OrderStatusUpdateDTO statusUpdateDTO);

    List<OrderDTO> getUserOrders(Long userId);

    List<OrderDTO> getRestaurantOrders(Long restaurantId);

    OrderDTO getOrderDetails(Long orderId);

    boolean orderExists(String idempotencyKey);

    void deleteOrder(Long orderId, Long restaurantId);
}
