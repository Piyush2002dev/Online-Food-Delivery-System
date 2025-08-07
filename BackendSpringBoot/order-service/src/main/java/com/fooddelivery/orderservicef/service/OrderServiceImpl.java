package com.fooddelivery.orderservicef.service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.fooddelivery.orderservicef.dto.AgentAssignmentDTO;
import com.fooddelivery.orderservicef.dto.AgentCreateDTO;
import com.fooddelivery.orderservicef.dto.AgentResponseDTO;
// New import
import com.fooddelivery.orderservicef.dto.CartDTO;
import com.fooddelivery.orderservicef.dto.CustomerProfileDTO;
import com.fooddelivery.orderservicef.dto.DeliveryStatus;
import com.fooddelivery.orderservicef.dto.DeliveryStatusUpdateRequestDTO;
import com.fooddelivery.orderservicef.dto.OrderDTO;
import com.fooddelivery.orderservicef.dto.OrderItemDTO;
import com.fooddelivery.orderservicef.dto.OrderRequestDTO;
import com.fooddelivery.orderservicef.dto.OrderStatusUpdateDTO;
import com.fooddelivery.orderservicef.dto.PaymentMethod;
import com.fooddelivery.orderservicef.dto.PaymentRequestDTO;
import com.fooddelivery.orderservicef.dto.PaymentResponseDTO;
import com.fooddelivery.orderservicef.exception.InvalidOperationException;
import com.fooddelivery.orderservicef.exception.ResourceNotFoundException;
import com.fooddelivery.orderservicef.model.Order;
import com.fooddelivery.orderservicef.model.OrderItem;
import com.fooddelivery.orderservicef.model.OrderStatus;
import com.fooddelivery.orderservicef.service.AgentServiceClient;
import com.fooddelivery.orderservicef.service.CartServiceImpl;
import com.fooddelivery.orderservicef.service.PaymentServiceClient;
import com.fooddelivery.orderservicef.service.RestaurantServiceClient;
import com.fooddelivery.orderservicef.repository.OrderItemRepository;
import com.fooddelivery.orderservicef.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {
	
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartServiceImpl cartServiceImpl;
    private final PaymentServiceClient paymentServiceClient;
    private final RestaurantServiceClient restaurantServiceClient;
    private final AgentServiceClient agentServiceClient; // Changed type
    private final CustomerServiceClient customerServiceClient;
    
    
   
    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            CartServiceImpl cartServiceImpl,
                            PaymentServiceClient paymentServiceClient,
                            RestaurantServiceClient restaurantServiceClient,
                            AgentServiceClient agentServiceClient, // Changed parameter type
                            CustomerServiceClient customerServiceClient) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartServiceImpl = cartServiceImpl;
        this.paymentServiceClient = paymentServiceClient;
        this.restaurantServiceClient = restaurantServiceClient;
        this.agentServiceClient = agentServiceClient; // Changed assignment
        this.customerServiceClient = customerServiceClient;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, timeout = 30)
    public OrderDTO placeOrder(OrderRequestDTO request, String idempotencyKey) {
    log.info("Received place order request: userId={}, restaurantId={}, idempotencyKey={}",
            request.getUserId(), request.getRestaurantId(), idempotencyKey);

    try {
        // Idempotency check
        if (orderRepository.existsByIdempotencyKey(idempotencyKey)) {
            log.warn("Duplicate order for idempotencyKey={}", idempotencyKey);
            return orderRepository.findByidempotencyKey(idempotencyKey)
                    .map(this::convertToDTO)
                    .orElseThrow(() -> {
                        log.error("Idempotency key exists but order not found. Key={}", idempotencyKey);
                        return new IllegalStateException("Inconsistent idempotency state");
                    });
        }

        Long userId = request.getUserId();
        Long restaurantId = request.getRestaurantId();

        if (userId == null || restaurantId == null) {
            log.error("Missing required fields: userId or restaurantId is null");
            throw new InvalidOperationException("User ID and Restaurant ID are required");
        }

        List<OrderItemDTO> items = request.getItems();
        if (items == null || items.isEmpty()) {
            log.warn("Attempt to place order with empty items for userId={}", userId);
            throw new InvalidOperationException("Cannot place order with empty items");
        }

        double totalAmount = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        log.info("Total order amount: {}", totalAmount);

        // ✅ Step 1: Create and save the order first
        Order order = createOrder(request, idempotencyKey, totalAmount);
        List<OrderItem> orderItems = convertRequestItemsToOrderItems(items, order);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        // ✅ Step 2: Process payment with valid orderId
        PaymentResponseDTO paymentResponse;
        try {
            PaymentRequestDTO paymentRequest = new PaymentRequestDTO();
            paymentRequest.setOrderId(savedOrder.getOrderId()); // ✅ FIXED
            paymentRequest.setPaymentAmount(totalAmount);
            // ✅ Use payment method from request, default to Card if not specified
            String paymentMethodStr = request.getPaymentMethod() != null ? request.getPaymentMethod() : "Card";
            PaymentMethod paymentMethod;
            try {
                paymentMethod = PaymentMethod.valueOf(paymentMethodStr);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid payment method '{}', defaulting to Card", paymentMethodStr);
                paymentMethod = PaymentMethod.Card;
            }
            paymentRequest.setPaymentMethod(paymentMethod);
            paymentRequest.setCreatedBy(userId.toString());

            log.info("Processing payment with method: {}", paymentMethod);
            paymentResponse = paymentServiceClient.processPayment(paymentRequest);
            log.info("Payment successful. Payment ID={}", paymentResponse.getPaymentId());
        } catch (Exception ex) {
            log.error("Payment failed for orderId={}", savedOrder.getOrderId(), ex);
            throw new InvalidOperationException("Payment processing failed");
        }

        // ✅ Step 3: Update order with payment ID
        savedOrder.setPaymentId(paymentResponse.getPaymentId());
        orderRepository.save(savedOrder); // Optional: persist paymentId

        log.info("Order placed with ID={} and paymentId={}", savedOrder.getOrderId(), savedOrder.getPaymentId());
        return convertToDTO(savedOrder);

    } catch (InvalidOperationException | ResourceNotFoundException ex) {
        log.error("Business validation failed during order placement", ex);
        throw ex;
    } catch (Exception ex) {
        log.error("Unexpected error while placing order", ex);
        throw new RuntimeException("Failed to place order", ex);
    }
}


private List<OrderItem> convertRequestItemsToOrderItems(List<OrderItemDTO> items, Order order) {
    return items.stream()
        .map(dto -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setMenuItemId(dto.getMenuItemId());
            item.setItemName(dto.getItemName());
            item.setQuantity(dto.getQuantity());
            item.setPrice(dto.getPrice());
            return item;
        })
        .collect(Collectors.toList());
}


    @Transactional(isolation = Isolation.REPEATABLE_READ, timeout = 10)
    public OrderDTO updateOrderStatus(OrderStatusUpdateDTO statusUpdateDTO) {
        log.info("Updating order status: orderId={}, newStatus={}, restaurantId={}",
                statusUpdateDTO.getOrderId(), statusUpdateDTO.getStatus(), statusUpdateDTO.getRestaurantId());

        try {
            Order order = orderRepository.findByIdWithLock(statusUpdateDTO.getOrderId())
                    .orElseThrow(() -> {
                        log.error("Order not found for ID={}", statusUpdateDTO.getOrderId());
                        return new ResourceNotFoundException("Order not found");
                    });

            if (!order.getRestaurantId().equals(statusUpdateDTO.getRestaurantId())) {
                log.warn("Unauthorized update attempt by restaurantId={} for orderId={}",
                        statusUpdateDTO.getRestaurantId(), order.getOrderId());
                throw new InvalidOperationException("Restaurant is not authorized to update this order");
            }

            if (!order.getStatus().canTransitionTo(statusUpdateDTO.getStatus())) {
                log.warn("Invalid status transition from {} to {}",
                        order.getStatus(), statusUpdateDTO.getStatus());
                throw new InvalidOperationException(String.format("Invalid status transition from %s to %s",
                        order.getStatus(), statusUpdateDTO.getStatus()));
            }
               
            OrderStatus oldStatus = order.getStatus();
            order.setStatus(statusUpdateDTO.getStatus());

            handleStatusUpdatesAfterTransition(order);

            Order updatedOrder = orderRepository.save(order);

            log.info("Order status updated successfully for orderId={} to status={}",
                    updatedOrder.getOrderId(), updatedOrder.getStatus());

            return convertToDTO(updatedOrder);

        } catch (InvalidOperationException | ResourceNotFoundException ex) {
            log.error("Order status update failed due to validation", ex);
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error while updating order status", ex);
            throw new RuntimeException("Failed to update order status", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrders(Long userId) {
        log.info("user orders retrieved !");
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getRestaurantOrders(Long restaurantId) {
        log.info("restaurant orders retrieved !");
        return orderRepository.findByRestaurantId(restaurantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderDetails(Long orderId) {
        log.info(" order "+orderId+ " details retrieved !");
        return orderRepository.findById(orderId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Transactional(readOnly = true)
    public boolean orderExists(String idempotencyKey) {
        return orderRepository.existsByIdempotencyKey(idempotencyKey);
    }

    @Transactional
    public void deleteOrder(Long orderId, Long restaurantId) {
        log.info("=== DELETE ORDER SERVICE METHOD CALLED ===");
        log.info("Attempting to delete order {} for restaurant {}", orderId, restaurantId);
        
        // Check if order exists
        log.info("Searching for order with ID: {}", orderId);
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        
        if (orderOptional.isEmpty()) {
            log.error("Order not found with id: {}", orderId);
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }
        
        Order order = orderOptional.get();
        log.info("Order found - ID: {}, Restaurant ID: {}, Status: {}, Customer ID: {}", 
                order.getOrderId(), order.getRestaurantId(), order.getStatus(), order.getUserId());
        
        // Check restaurant ownership
        log.info("Checking if order belongs to restaurant. Order Restaurant ID: {}, Request Restaurant ID: {}", 
                order.getRestaurantId(), restaurantId);
        
        if (!order.getRestaurantId().equals(restaurantId)) {
            log.error("Order ownership validation failed - Order Restaurant ID: {}, Request Restaurant ID: {}", 
                    order.getRestaurantId(), restaurantId);
            throw new IllegalArgumentException("Order does not belong to the specified restaurant");
        }
        
        log.info("Restaurant ownership validated successfully");
        
        // Check order status
        log.info("Checking order status for deletion. Current status: {}", order.getStatus());
        if (order.getStatus() != OrderStatus.COMPLETED && order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.DECLINED) {
            log.error("Invalid status for deletion. Current status: {}, Expected: COMPLETED, CANCELLED, or DECLINED", 
                    order.getStatus());
            throw new IllegalStateException("Only completed, cancelled, or declined orders can be deleted. Current status: " + order.getStatus());
        }
        
        log.info("Order status validation passed - Status: {}", order.getStatus());
        
        // Perform deletion
        log.info("Proceeding with order deletion for order ID: {}", orderId);
        orderRepository.deleteById(orderId);
        log.info("Order {} successfully deleted from database for restaurant {}", orderId, restaurantId);
        log.info("=== DELETE ORDER OPERATION COMPLETED ===");
    }

    private double calculateTotalAmount(CartDTO cartDTO) {
        return cartDTO.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    private Order createOrder(OrderRequestDTO request, String idempotencyKey, double totalAmount) {
        Order order = new Order();
        order.setIdempotencyKey(idempotencyKey);
        order.setUserId(request.getUserId());
        order.setRestaurantId(request.getRestaurantId());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(totalAmount);
        order.setOrderTime(LocalDateTime.now());
        order.setDeliveryAddress(request.getDeliveryAddress());
        return order;
    }

    private List<OrderItem> convertCartItemsToOrderItems(CartDTO cartDTO, Order order) {
        return cartDTO.getItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setMenuItemId(cartItem.getMenuItemId());
                    orderItem.setItemName(cartItem.getItemName());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());
    }

    private PaymentResponseDTO processPayment(Order order) {
            PaymentRequestDTO paymentRequest = new PaymentRequestDTO();
            paymentRequest.setOrderId(order.getOrderId());
            paymentRequest.setPaymentAmount(order.getTotalAmount());
            // ✅ Use Cash as default for this method since it's used for order updates
            paymentRequest.setPaymentMethod(PaymentMethod.Cash);
            paymentRequest.setCreatedBy(order.getUserId().toString());
            return paymentServiceClient.processPayment(paymentRequest);
        }

    private void handleStatusUpdatesAfterTransition(Order order) {
        if (order.getStatus() == OrderStatus.OUT_FOR_DELIVERY) {
            assignDeliveryAgent(order);
            CompletableFuture.runAsync(() -> {
                try {
                    Thread.sleep(Duration.ofSeconds(30 + new Random().nextInt(16)).toMillis());
                    completeOrderAsync(order.getOrderId());
                } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt(); // Restore interrupt status
                    log.warn("Order auto-completion interrupted for orderId={}", order.getOrderId());
                }
            });
        } else if (order.getStatus() == OrderStatus.COMPLETED) {
            order.setDeliveryTime(LocalDateTime.now());
            // New: Update delivery status in delivery-service when order is completed
            if (order.getDeliveryId() != null) {
                try {
                    DeliveryStatusUpdateRequestDTO statusUpdate = DeliveryStatusUpdateRequestDTO.builder()
                            .status(DeliveryStatus.DELIVERED) // Matches DeliveryStatus.DELIVERED enum name
                            .estimatedDeliveryTime(LocalDateTime.now()) // Set actual delivery time
                            .build();
                    agentServiceClient.updateDeliveryStatus(order.getDeliveryId(), statusUpdate);
                    log.info("Delivery status updated to DELIVERED in delivery-service for deliveryId={}", order.getDeliveryId());
                } catch (Exception e) {
                    log.error("Failed to update delivery status in delivery-service for orderId={}: {}", order.getOrderId(), e.getMessage());
                    // Consider retry mechanism or alerting if this is critical
                }
            } else {
                log.warn("Order {} completed but no deliveryId found. Cannot update delivery-service status.", order.getOrderId());
            }
        }
    }

    @Transactional
    protected void completeOrderAsync(Long orderId) {
        Order o = orderRepository.findByIdWithLock(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found in async complete"));

        if (o.getStatus() == OrderStatus.OUT_FOR_DELIVERY && o.getStatus().canTransitionTo(OrderStatus.COMPLETED)) {
            o.setStatus(OrderStatus.COMPLETED);
            o.setDeliveryTime(LocalDateTime.now());
            orderRepository.save(o);
            log.info("Order auto-completed via async flow, orderId={}", orderId);
            // After auto-completion, call handleStatusUpdatesAfterTransition to propagate status
            handleStatusUpdatesAfterTransition(o);
        }
    }

private void assignDeliveryAgent(Order order) {
    // Step 1: Create a new agent with status ASSIGNED
    AgentCreateDTO newAgent = new AgentCreateDTO();
    newAgent.setAgentName("AutoAgent_" + UUID.randomUUID());
    newAgent.setAgentPhoneNumber("9999999999"); // You can randomize this if needed
    newAgent.setAgentStatus("ASSIGNED");

    AgentResponseDTO createdAgent = agentServiceClient.createAgent(newAgent);

    // Step 2: Assign agent to order
    order.setDeliveryAgentId(createdAgent.getAgentId());

    // Step 3: Save the order
    orderRepository.save(order);

    log.info("New agent assigned to order. Agent ID={}", createdAgent.getAgentId());
}


       
    public OrderDTO convertToDTO(Order order) {
        log.info("Converting Order to DTO: {}", order.getOrderId());
        if (order == null) return null;

        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUserId());
        dto.setRestaurantId(order.getRestaurantId());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setOrderTime(order.getOrderTime());
        dto.setDeliveryTime(order.getDeliveryTime());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentId(order.getPaymentId());
        dto.setIdempotencyKey(order.getIdempotencyKey());
        dto.setDeliveryAgentId(order.getDeliveryAgentId());
        dto.setDeliveryId(order.getDeliveryId()); // Map the new deliveryId field

        // Fetch and set customer information
        if (order.getUserId() != null) {
            try {
                CustomerProfileDTO customerProfile = customerServiceClient.getCustomerProfile(
                    order.getUserId().toString(), "CUSTOMER");
                if (customerProfile != null) {
                    dto.setCustomerName(customerProfile.getName());
                    dto.setCustomerPhone(customerProfile.getPhone() != null ? customerProfile.getPhone().toString() : null);
                    log.debug("Successfully fetched customer details for user ID: {}, Name: {}", 
                             order.getUserId(), customerProfile.getName());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch customer details for user ID: {}, Error: {}", 
                        order.getUserId(), e.getMessage());
                // Set fallback values if customer service is unavailable
                dto.setCustomerName("Customer #" + order.getUserId());
                dto.setCustomerPhone(null);
            }
        }

        if (order.getItems() != null) {
            List<OrderItemDTO> items = order.getItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setMenuItemId(item.getMenuItemId());
                    itemDTO.setItemName(item.getItemName());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    return itemDTO;
                })
                .collect(Collectors.toList());
            dto.setItems(items);
        } else {
            dto.setItems(Collections.emptyList());
        }
        return dto;
    }
      
    private OrderItemDTO convertToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setMenuItemId(orderItem.getMenuItemId());
        dto.setItemName(orderItem.getItemName());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }
}