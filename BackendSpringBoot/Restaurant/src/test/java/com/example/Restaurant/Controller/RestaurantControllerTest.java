package com.example.Restaurant.Controller;

import com.example.Restaurant.Dto.*;
import com.example.Restaurant.Exception.*;
import com.example.Restaurant.Service.RestaurantService;
import com.example.Restaurant.Util.AppConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RestaurantController.class)
class RestaurantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Suppress warning for removal of MockBean annotation from specific module if it's an old Spring version issue
    @SuppressWarnings("removal")
    @MockBean
    private RestaurantService restaurantService;

    @Autowired
    private ObjectMapper objectMapper;

    // Register: Success
    @Test
    void testRegisterRestaurant_Success() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "a@example.com", "pass123");
        when(restaurantService.register(any())).thenReturn(new AuthResponseDTO(AppConstants.REGISTRATION_SUCCESS));

        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(AppConstants.REGISTRATION_SUCCESS));
    }

    // Register: Duplicate Email (Corrected for GlobalExceptionHandler output)
    @Test
    void testRegisterRestaurant_DuplicateEmail() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "a@example.com", "pass123");
        when(restaurantService.register(any()))
                .thenThrow(new DuplicateRestaurantException(AppConstants.EMAIL_ALREADY_EXISTS));

        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict()) // Expect 409 Conflict
                // Asserting against the 'message' field in the ErrorDetails DTO returned by GlobalExceptionHandler
                .andExpect(jsonPath("$.message").value(AppConstants.EMAIL_ALREADY_EXISTS));
    }

    // Register: Missing Name
    @Test
    void testRegisterRestaurant_MissingName() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("", "Hyd", "a@example.com", "pass123");
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Register: Missing Location
    @Test
    void testRegisterRestaurant_MissingLocation() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "", "a@example.com", "pass123");
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Register: Missing Email
    @Test
    void testRegisterRestaurant_MissingEmail() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "", "pass123");
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Register: Missing Password
    @Test
    void testRegisterRestaurant_MissingPassword() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "a@example.com", "");
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Register: Invalid Email Format
    @Test
    void testRegisterRestaurant_InvalidEmailFormat() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "invalid-email", "pass123");
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Register: Empty JSON Payload
    @Test
    void testRegisterRestaurant_EmptyPayload() throws Exception {
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // Register: Malformed JSON
    @Test
    void testRegisterRestaurant_InvalidJsonFormat() throws Exception {
        String badJson = "{ \"name\": \"Cafe A\", \"email\": \"abc@example.com\" ";
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(badJson))
                .andExpect(status().isBadRequest());
                // The exact content might vary based on Spring's default error message for malformed JSON,
                // or if you have a specific handler for HttpMessageNotReadableException
    }

    // Register: Unexpected Exception
    @Test
    void testRegisterRestaurant_UnexpectedException() throws Exception {
        RestaurantRegisterDTO dto = new RestaurantRegisterDTO("Cafe A", "Hyd", "a@example.com", "pass123");
        when(restaurantService.register(any())).thenThrow(new RuntimeException("Something went wrong"));
        mockMvc.perform(post("/api/restaurants/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isInternalServerError());
                // Expecting 500. The content().string() assertion would depend on your GlobalExceptionHandler's
                // generic exception handling (e.g., it might return "Internal server error" in the 'message' field)
    }

    // Login: Success
    @Test
    void testLoginRestaurant_Success() throws Exception {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("a@example.com", "pass123");
        when(restaurantService.login(any())).thenReturn(new AuthResponseDTO(AppConstants.LOGIN_SUCCESS));
        mockMvc.perform(post("/api/restaurants/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(AppConstants.LOGIN_SUCCESS));
    }

    // Login: Invalid Credentials (Corrected for GlobalExceptionHandler output)
    @Test
    void testLoginRestaurant_InvalidCredentials() throws Exception {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("wrong@example.com", "wrongpass");
        when(restaurantService.login(any()))
                .thenThrow(new InvalidCredentialsException(AppConstants.INVALID_CREDENTIALS));
        mockMvc.perform(post("/api/restaurants/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized()) // Expect 401 Unauthorized
                // Asserting against the 'message' field in the ErrorDetails DTO
                .andExpect(jsonPath("$.message").value(AppConstants.INVALID_CREDENTIALS));
    }

    // Login: Missing Email
    @Test
    void testLoginRestaurant_MissingEmail() throws Exception {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("", "pass123");
        mockMvc.perform(post("/api/restaurants/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Login: Missing Password
    @Test
    void testLoginRestaurant_MissingPassword() throws Exception {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("test@example.com", "");
        mockMvc.perform(post("/api/restaurants/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Login: Empty JSON Payload
    @Test
    void testLoginRestaurant_EmptyPayload() throws Exception {
        mockMvc.perform(post("/api/restaurants/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // Login: Malformed JSON
    @Test
    void testLoginRestaurant_InvalidJsonFormat() throws Exception {
        String badJson = "{ \"email\": \"abc@example.com\" ";
        mockMvc.perform(post("/api/restaurants/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(badJson))
                .andExpect(status().isBadRequest());
                // Similar to register, the content message might vary
    }

    // Login: Unexpected Exception
    @Test
    void testLoginRestaurant_UnexpectedException() throws Exception {
        RestaurantLoginDTO dto = new RestaurantLoginDTO("a@example.com", "pass123");
        when(restaurantService.login(any())).thenThrow(new RuntimeException("Something went wrong"));
        mockMvc.perform(post("/api/restaurants/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isInternalServerError());
                // Expecting 500
    }

    // --- New Tests for Get Restaurant by ID ---

    // Get By ID: Success
    @Test
    void testGetRestaurantById_Success() throws Exception {
        Long restaurantId = 1L;
        RestaurantDTO restaurantDTO = new RestaurantDTO(restaurantId, "Test Restaurant", "Test Location", "test@example.com");
        when(restaurantService.getRestaurantById(restaurantId)).thenReturn(restaurantDTO);

        mockMvc.perform(get("/api/restaurants/{id}", restaurantId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(restaurantId))
                .andExpect(jsonPath("$.name").value("Test Restaurant"))
                .andExpect(jsonPath("$.location").value("Test Location"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    // Get By ID: Not Found (Corrected for GlobalExceptionHandler output)
    @Test
    void testGetRestaurantById_NotFound() throws Exception {
        Long nonExistentId = 99L;
        when(restaurantService.getRestaurantById(nonExistentId))
                .thenThrow(new RestaurantNotFoundException(AppConstants.RESTAURANT_NOT_FOUND + nonExistentId));

        mockMvc.perform(get("/api/restaurants/{id}", nonExistentId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()) // Expect 404 Not Found
                // Asserting against the 'message' field in the ErrorDetails DTO
                .andExpect(jsonPath("$.message").value(AppConstants.RESTAURANT_NOT_FOUND + nonExistentId));
    }

    // Get By ID: Unexpected Exception
    @Test
    void testGetRestaurantById_UnexpectedException() throws Exception {
        Long restaurantId = 1L;
        when(restaurantService.getRestaurantById(restaurantId)).thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(get("/api/restaurants/{id}", restaurantId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError()); // Expect 500 for any other unexpected exception
    }
}