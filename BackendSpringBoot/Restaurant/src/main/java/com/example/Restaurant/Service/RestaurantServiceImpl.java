package com.example.Restaurant.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Restaurant.Dto.*; // Assuming RestaurantDTO is here
import com.example.Restaurant.Entity.Restaurant;
import com.example.Restaurant.Exception.*; // Assuming ResourceNotFoundException and DuplicateRestaurantException are here
import com.example.Restaurant.Repository.RestaurantRepository;
import com.example.Restaurant.Util.AppConstants;


/**
 * Implementation of the RestaurantService interface.
 * Handles business logic for restaurant registration, authentication, and retrieval.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantServiceImpl implements RestaurantService {

    
    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new restaurant in the system.
     *
     * @param registerDTO The restaurant registration details.
     * @return AuthResponseDTO containing the registration result.
     * @throws DuplicateRestaurantException If the email is already registered.
     */
    @Override
    public AuthResponseDTO register(RestaurantRegisterDTO dto) {
        if (restaurantRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateRestaurantException(AppConstants.EMAIL_ALREADY_EXISTS);
        }
        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setLocation(dto.getLocation());
        restaurant.setEmail(dto.getEmail());
        restaurant.setPassword(passwordEncoder.encode(dto.getPassword()));
        restaurantRepository.save(restaurant);
        return new AuthResponseDTO(AppConstants.REGISTRATION_SUCCESS);
    }

    /**
     * Authenticates a restaurant login attempt.
     *
     * @param loginDTO The restaurant login credentials.
     * @return AuthResponseDTO containing authentication response.
     * @throws InvalidCredentialsException If the email or password is incorrect.
     */
    @Override
    public AuthResponseDTO login(RestaurantLoginDTO dto) {
        Restaurant restaurant = restaurantRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException(AppConstants.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(dto.getPassword(), restaurant.getPassword())) {
            throw new InvalidCredentialsException(AppConstants.INVALID_CREDENTIALS);
        }
        return new AuthResponseDTO(AppConstants.LOGIN_SUCCESS);
    }

    /**
     * Retrieves details of a restaurant by its ID.
     *
     * @param id The ID of the restaurant.
     * @return RestaurantDTO containing the restaurant's details.
     * @throws ResourceNotFoundException If no restaurant is found with the given ID.
     */
    @Override
    public RestaurantDTO getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException(AppConstants.RESTAURANT_NOT_FOUND + id));

        RestaurantDTO restaurantDTO = new RestaurantDTO();
        restaurantDTO.setId(restaurant.getId());
        restaurantDTO.setName(restaurant.getName());
        restaurantDTO.setLocation(restaurant.getLocation());
        restaurantDTO.setEmail(restaurant.getEmail());
        return restaurantDTO;
    }
    
    public Optional<UserAuthDetailsDTO> findUserAuthDetailsByIdentifier(String identifier) {
        log.info("Attempting to find customer auth details for identifier: {}", identifier);

        Optional<Restaurant> restaurantOptional = restaurantRepository.findByEmail(identifier);
        log.info("{}",restaurantOptional);
        if (restaurantOptional.isEmpty()) {
        	restaurantOptional = restaurantRepository.findByEmail(identifier);
        }

        if (restaurantOptional.isPresent()) {
            Restaurant restaurant = restaurantOptional.get();
            UserAuthDetailsDTO dto = new UserAuthDetailsDTO(
            		restaurant.getId(),
            		restaurant.getName(),
            		restaurant.getEmail(),
            		restaurant.getPassword(),
                    Collections.singletonList("RESTAURANT")
            );
            log.debug("Found customer auth details for identifier: {}", identifier);
            return Optional.of(dto);
        } else {
            log.warn("Customer auth details not found for identifier: {}", identifier);
            return Optional.empty();
        }
    }
    
    
    @Override
    public List<RestaurantDTO> getAllRestaurants(){
    	
    	List<Restaurant> allRestaurants = restaurantRepository.findAll();
    	
		return allRestaurants.stream()
                .map(restaurant -> {
                    RestaurantDTO dto = new RestaurantDTO();
                    dto.setId(restaurant.getId());
                    dto.setName(restaurant.getName());
                    dto.setLocation(restaurant.getLocation());
                    dto.setEmail(restaurant.getEmail());
                    return dto;
                })
                .toList();
    	
    }
}
