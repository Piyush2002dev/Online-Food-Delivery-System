package com.example.Restaurant.Service;

import java.util.List;
import java.util.Optional;

import com.example.Restaurant.Dto.*;
import com.example.Restaurant.Exception.InvalidCredentialsException;

/**
 * Service interface for managing restaurant-related operations.
 * Defines methods for restaurant registration, authentication, and retrieval.
 */
public interface RestaurantService {

    /**
     * Registers a new restaurant.
     *
     * @param registerDTO The restaurant registration details.
     * @return AuthResponseDTO containing authentication response.
     */
    AuthResponseDTO register(RestaurantRegisterDTO registerDTO);

    /**
     * Authenticates a restaurant login.
     *
     * @param loginDTO The restaurant login credentials.
     * @return AuthResponseDTO containing authentication response.
     * @throws InvalidCredentialsException If login credentials are incorrect.
     */
    AuthResponseDTO login(RestaurantLoginDTO loginDTO) throws InvalidCredentialsException;

    /**
     * Retrieves details of a restaurant by its ID.
     *
     * @param id The ID of the restaurant.
     * @return RestaurantDTO containing the restaurant's details.
     * @throws ResourceNotFoundException If no restaurant is found with the given ID.
     */
    RestaurantDTO getRestaurantById(Long id);

	Optional<UserAuthDetailsDTO> findUserAuthDetailsByIdentifier(String email);

	List<RestaurantDTO> getAllRestaurants();
}