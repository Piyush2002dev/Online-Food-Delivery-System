package com.example.Restaurant.Controller;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Restaurant.Dto.*; // Assuming RestaurantDTO is here
import com.example.Restaurant.Exception.InvalidCredentialsException;
import com.example.Restaurant.Service.RestaurantService;

/**
 * Controller for managing restaurant-related operations.
 * Provides end points for restaurant registration, login, and retrieval.
 */
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    /**
     * Registers a new restaurant.
     *
     * @param dto The restaurant registration details.
     * @return ResponseEntity containing authentication response.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RestaurantRegisterDTO dto) {
        return ResponseEntity.ok(restaurantService.register(dto));
    }

    /**
     * Authenticates a restaurant login.
     *
     * @param dto The restaurant login credentials.
     * @return ResponseEntity containing authentication response.
     * @throws InvalidCredentialsException If login credentials are incorrect.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody RestaurantLoginDTO dto) throws InvalidCredentialsException {
        return ResponseEntity.ok(restaurantService.login(dto));
    }

    /**
     * Retrieves restaurant details by its ID.
     *
     * @param id The ID of the restaurant to retrieve.
     * @return ResponseEntity containing the restaurant details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }
    
    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants(){
    	return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }
}
