package com.fooddelivery.orderservicef.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fooddelivery.orderservicef.model.Order;
import com.fooddelivery.orderservicef.model.OrderStatus;

import jakarta.persistence.LockModeType;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByUserId(Long userId);

	List<Order> findByRestaurantId(Long restaurantId);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT o FROM Order o WHERE o.orderId = :orderId")
	Optional<Order> findByIdWithLock(Long orderId);

	boolean existsByIdempotencyKey(String idempotencyKey);

	Optional<Order> findByidempotencyKey(String idempotencyKey);
}