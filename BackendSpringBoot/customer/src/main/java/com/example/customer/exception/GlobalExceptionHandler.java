package com.example.customer.exception;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

/**
 * Global exception handler for customer-related exceptions.
 * Provides centralized error handling for REST APIs.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
@SuppressWarnings("unused")
private static final String ERROR_MESSAGE_KEY="message";
    /**
     * Handles exceptions when a customer is not found.
     *
     * @param ex the exception instance.
     * @return a `404 NOT FOUND` response with the exception message.
     */
	@ExceptionHandler(CustomerNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleCustomerNotFoundException(CustomerNotFoundException ex) {
	    Map<String, String> error = new HashMap<>();
	    error.put(ERROR_MESSAGE_KEY, ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

    /**
     * Handles exceptions when a duplicate customer is found during registration.
     *
     * @param ex the exception instance.
     * @return a `409 CONFLICT` response with the exception message.
     */
	@ExceptionHandler(DuplicateCustomerException.class)
	public ResponseEntity<Map<String, String>> handleDuplicateCustomerException(DuplicateCustomerException ex) {
	    Map<String, String> error = new HashMap<>();
	    error.put(ERROR_MESSAGE_KEY, ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

    /**
     * Handles exceptions when invalid credentials are provided during authentication.
     *
     * @param ex the exception instance.
     * @return a `401 UNAUTHORIZED` response with the exception message.
     */	 
	    @ExceptionHandler(MethodArgumentNotValidException.class)
	    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
	        Map<String, String> errors = new HashMap<>();
	 
	        ex.getBindingResult().getFieldErrors().forEach(error -> {
	            String fieldName = error.getField();      // e.g., "email" or "password"
	            String message = error.getDefaultMessage(); // e.g., "Email is required"
	            errors.put(fieldName, message);
	        });
	
	        return ResponseEntity.badRequest().body(errors);
	    }
	 
	    @ExceptionHandler(InvalidCredentialsException.class)
	    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
	        Map<String, String> error = new HashMap<>();
	        error.put("error", ex.getMessage());
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
	    }
	
}