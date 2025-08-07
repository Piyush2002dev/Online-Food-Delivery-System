package com.example.Restaurant.Exception;

import com.example.Restaurant.Dto.ErrorResponse; // Import the new ErrorResponse DTO
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest; // Import WebRequest
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.HashMap;
import java.util.Map;

/**
 * **GlobalExceptionHandler**: Centralized exception handling for the Restaurant application.
 * Uses `@RestControllerAdvice` to provide consistent error responses across all controllers.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles **validation errors** (`@Valid`, `@Validated`).
     * Returns a map of field errors (field name: error message) with a **400 Bad Request** status.
     * @param ex The `MethodArgumentNotValidException`.
     * @return `ResponseEntity` with error map and `HttpStatus.BAD_REQUEST`.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        // For validation errors, returning a map is common. If your tests need a single "message" field,
        // you would transform this map into an ErrorResponse DTO with a concatenated message.
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles **duplicate restaurant entries**.
     * Returns a structured `ErrorResponse` with a **409 Conflict** status.
     * @param ex The `DuplicateRestaurantException`.
     * @param request The current web request.
     * @return `ResponseEntity` with `ErrorResponse` and `HttpStatus.CONFLICT`.
     */
    @ExceptionHandler(DuplicateRestaurantException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(DuplicateRestaurantException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * Handles **invalid authentication credentials**.
     * Returns a structured `ErrorResponse` with a **401 Unauthorized** status.
     * @param ex The `InvalidCredentialsException`.
     * @param request The current web request.
     * @return `ResponseEntity` with `ErrorResponse` and `HttpStatus.UNAUTHORIZED`.
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.UNAUTHORIZED.value(),
            HttpStatus.UNAUTHORIZED.getReasonPhrase(),
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handles **ResourceNotFoundException** (e.g., for `getRestaurantById`).
     * Returns a structured `ErrorResponse` with a **404 Not Found** status.
     * @param ex The `ResourceNotFoundException`.
     * @param request The current web request.
     * @return `ResponseEntity` with `ErrorResponse` and `HttpStatus.NOT_FOUND`.
     */
    @ExceptionHandler(RestaurantNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(RestaurantNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles **malformed JSON requests**.
     * Returns a structured `ErrorResponse` with a generic message and a **400 Bad Request** status.
     * @param ex The `HttpMessageNotReadableException`.
     * @param request The current web request.
     * @return `ResponseEntity` with `ErrorResponse` and `HttpStatus.BAD_REQUEST`.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleInvalidJson(HttpMessageNotReadableException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Malformed JSON request", // Generic message for security/simplicity
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Global handler for **any unhandled exceptions**.
     * Returns a structured `ErrorResponse` with a generic "Internal server error" message
     * and a **500 Internal Server Error** status.
     * @param ex The generic `Exception`.
     * @param request The current web request.
     * @return `ResponseEntity` with `ErrorResponse` and `HttpStatus.INTERNAL_SERVER_ERROR`.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            "Internal server error: " + (ex.getMessage() != null ? ex.getMessage() : "Unknown error"), // Include original message if available
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}