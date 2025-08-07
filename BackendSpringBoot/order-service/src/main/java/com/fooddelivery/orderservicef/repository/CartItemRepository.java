package com.fooddelivery.orderservicef.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fooddelivery.orderservicef.model.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}