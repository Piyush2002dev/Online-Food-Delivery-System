package com.delivery.delivery_service.repository;

import com.delivery.delivery_service.entity.DeliveryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link DeliveryEntity}.
 * Provides standard CRUD operations and custom query methods for delivery data.
 */
public interface DeliveryRepository extends JpaRepository<DeliveryEntity, Long> {
    /**
     * Retrieves a delivery record by its associated order ID.
     * The result is wrapped in an {@link Optional} to handle cases where no delivery is found.
     *
     * @param orderId The unique identifier of the order.
     * @return An {@link Optional} containing the {@link DeliveryEntity} if found, otherwise an empty Optional.
     */
    Optional<DeliveryEntity> findByOrderId(Long orderId);

    /**
     * Checks if a delivery record already exists for a given order ID.
     * This is useful for preventing duplicate delivery assignments for the same order.
     *
     * @param orderId The unique identifier of the order to check.
     * @return {@code true} if a delivery exists for the given order ID, {@code false} otherwise.
     */
    boolean existsByOrderId(Long orderId);
}
