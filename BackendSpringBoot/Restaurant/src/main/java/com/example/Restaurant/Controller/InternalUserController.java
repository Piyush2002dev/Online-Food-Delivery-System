package com.example.Restaurant.Controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Restaurant.Controller.InternalUserController;
import com.example.Restaurant.Dto.UserAuthDetailsDTO;
import com.example.Restaurant.Service.RestaurantService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/internal/users")
@Slf4j
public class InternalUserController {
	
	final private RestaurantService restaurantService;
	
	public InternalUserController(RestaurantService restaurantService) {
		this.restaurantService = restaurantService; 
	}

	
	@GetMapping("/by-email/{email}")
    public ResponseEntity<UserAuthDetailsDTO> getUserByUsername(@PathVariable String email) {
        log.info("Received internal request to fetch user details for: {}", email);

        Optional<UserAuthDetailsDTO> userAuthDetailsDTO = restaurantService.findUserAuthDetailsByIdentifier(email);

        if (userAuthDetailsDTO.isPresent()) {
            return ResponseEntity.ok(userAuthDetailsDTO.get());
        } else {
            log.warn("Internal user lookup failed for: {}", email);
            return ResponseEntity.notFound().build();
        }

	}
}
