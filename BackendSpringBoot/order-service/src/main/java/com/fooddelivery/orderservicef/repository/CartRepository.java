package com.fooddelivery.orderservicef.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fooddelivery.orderservicef.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
	@EntityGraph(attributePaths = "items")
    Optional<Cart> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}