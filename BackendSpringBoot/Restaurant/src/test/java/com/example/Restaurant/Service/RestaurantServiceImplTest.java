package com.example.Restaurant.Service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Restaurant.Dto.AuthResponseDTO;
import com.example.Restaurant.Dto.RestaurantLoginDTO;
import com.example.Restaurant.Dto.RestaurantRegisterDTO;
import com.example.Restaurant.Dto.RestaurantDTO; // Import the new DTO
import com.example.Restaurant.Entity.Restaurant;
import com.example.Restaurant.Exception.DuplicateRestaurantException;
import com.example.Restaurant.Exception.InvalidCredentialsException;
import com.example.Restaurant.Exception.RestaurantNotFoundException; // Import the new exception
import com.example.Restaurant.Repository.RestaurantRepository;
import com.example.Restaurant.Util.AppConstants;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestaurantServiceImplTest {

    @InjectMocks
    private RestaurantServiceImpl restaurantService;

    @Mock
    private RestaurantRepository restaurantRepository;

    // Registration - Success
    @Test
    void testRegister_Success() {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "a@example.com", "pass123");
        // Mock existsByEmail to return false for successful registration
        when(restaurantRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        // Mock save to return a saved Restaurant entity
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(new Restaurant(1L, "Cafe A", "Hyd", "a@example.com", "pass123"));

        AuthResponseDTO response = restaurantService.register(dto);

        assertNotNull(response);
        assertEquals(AppConstants.REGISTRATION_SUCCESS, response.getMessage());
        // Verify interactions
        verify(restaurantRepository, times(1)).existsByEmail(dto.getEmail());
        verify(restaurantRepository, times(1)).save(any(Restaurant.class));
    }

    // Registration - Duplicate Email
    @Test
    void testRegister_DuplicateEmail() {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "a@example.com", "pass123");
        // Mock existsByEmail to return true for duplicate email scenario
        when(restaurantRepository.existsByEmail(dto.getEmail())).thenReturn(true);

        // Assert that DuplicateRestaurantException is thrown
        DuplicateRestaurantException thrown = assertThrows(DuplicateRestaurantException.class, () -> restaurantService.register(dto));

        assertEquals(AppConstants.EMAIL_ALREADY_EXISTS, thrown.getMessage());
        // Verify interactions
        verify(restaurantRepository, times(1)).existsByEmail(dto.getEmail());
        verify(restaurantRepository, never()).save(any(Restaurant.class)); // Ensure save is NOT called
    }

    // Login - Success
    @Test
    void testLogin_Success() {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("a@example.com", "pass123");
        Restaurant restaurant = new Restaurant(1L, "Cafe A", "Hyd", "a@example.com", "pass123");
        // Mock findByEmail to return the existing restaurant
        when(restaurantRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(restaurant));

        AuthResponseDTO response = restaurantService.login(dto);

        assertNotNull(response);
        assertEquals(AppConstants.LOGIN_SUCCESS, response.getMessage());
        // Verify interactions
        verify(restaurantRepository, times(1)).findByEmail(dto.getEmail());
    }

    // Login - Invalid Password
    @Test
    void testLogin_InvalidPassword() {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("a@example.com", "wrongpass");
        Restaurant restaurant = new Restaurant(1L, "Cafe A", "Hyd", "a@example.com", "correctpass"); // Stored password (different from DTO)
        // Mock findByEmail to return the existing restaurant
        when(restaurantRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(restaurant));

        // Assert that InvalidCredentialsException is thrown
        InvalidCredentialsException thrown = assertThrows(InvalidCredentialsException.class, () -> restaurantService.login(dto));

        assertEquals(AppConstants.INVALID_CREDENTIALS, thrown.getMessage());
        // Verify interactions
        verify(restaurantRepository, times(1)).findByEmail(dto.getEmail());
    }

    // Login - Email Not Found
    @Test
    void testLogin_EmailNotFound() {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("notfound@example.com", "pass123");
        // Mock findByEmail to return empty for non-existent email
        when(restaurantRepository.findByEmail(dto.getEmail())).thenReturn(Optional.empty());

        // Assert that InvalidCredentialsException is thrown
        InvalidCredentialsException thrown = assertThrows(InvalidCredentialsException.class, () -> restaurantService.login(dto));

        assertEquals(AppConstants.INVALID_CREDENTIALS, thrown.getMessage());
        // Verify interactions
        verify(restaurantRepository, times(1)).findByEmail(dto.getEmail());
    }

    // --- New Tests for Get Restaurant by ID ---

    // Get By ID - Success
    @Test
    void testGetRestaurantById_Success() {
        Long restaurantId = 1L;
        // Create a mock Restaurant entity to be returned by the repository
        Restaurant mockRestaurant = new Restaurant(restaurantId, "Test Restaurant", "Test Location", "test@example.com", "secretpass");
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(mockRestaurant));

        // Call the service method
        RestaurantDTO resultDTO = restaurantService.getRestaurantById(restaurantId);

        // Assertions
        assertNotNull(resultDTO);
        assertEquals(restaurantId, resultDTO.getId());
        assertEquals("Test Restaurant", resultDTO.getName());
        assertEquals("Test Location", resultDTO.getLocation());
        assertEquals("test@example.com", resultDTO.getEmail());
        // Ensure password is NOT exposed in DTO
        //assertNull(resultDTO.getPassword()); // Assuming password field exists but is null in DTO as it's not set

        // Verify repository interaction
        verify(restaurantRepository, times(1)).findById(restaurantId);
    }

    // Get By ID - Not Found
    @Test
    void testGetRestaurantById_NotFound() {
        Long nonExistentId = 99L;
        // Mock findById to return empty for non-existent ID
        when(restaurantRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Assert that ResourceNotFoundException is thrown
        RestaurantNotFoundException thrown = assertThrows(RestaurantNotFoundException.class, () ->
                restaurantService.getRestaurantById(nonExistentId)
        );

        assertEquals(AppConstants.RESTAURANT_NOT_FOUND + nonExistentId, thrown.getMessage());
        // Verify repository interaction
        verify(restaurantRepository, times(1)).findById(nonExistentId);
    }
}