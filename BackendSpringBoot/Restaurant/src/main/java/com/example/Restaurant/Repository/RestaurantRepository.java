package com.example.Restaurant.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Restaurant.Dto.RestaurantDTO;
import com.example.Restaurant.Entity.Restaurant;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing restaurant entities.
 * Provides database access methods using Spring Data JPA.
 */
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    /**
     * Finds a restaurant by its email.
     *
     * @param email The email address to search for.
     * @return An Optional containing the restaurant if found.
     */
    Optional<Restaurant> findByEmail(String email);

    /**
     * Checks if a restaurant with a given email already exists.
     *
     * @param email The email address to check.
     * @return true if the restaurant exists, false otherwise.
     */
    boolean existsByEmail(String email);
}
