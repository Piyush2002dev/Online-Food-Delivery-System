//
//
//package com.example.payment.exception;
//
//import lombok.extern.slf4j.Slf4j; // Provides the 'log' object for logging
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
///**
// * Global exception handler for the payment service.
// * This class uses Spring's {@code @RestControllerAdvice} to provide
// * centralized exception handling across all controllers in the application,
// * mapping specific exceptions to appropriate HTTP status codes and responses.
// */
//@RestControllerAdvice // Combines @ControllerAdvice and @ResponseBody
//@Slf4j // Enables logging for this class
//public class GlobalExceptionHandler {
//
//    /**
//     * Handles {@link ResourceNotFoundException} and returns an HTTP 404 Not Found status.
//     * This is typically used when a requested resource (like a payment by ID) does not exist.
//     *
//     * @param e The ResourceNotFoundException instance.
//     * @return A ResponseEntity with HttpStatus.NOT_FOUND and the exception message.
//     */
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<String> handleNotFound(ResourceNotFoundException e) {
//        // Log the exception at WARN level, as it's an expected business-level error.
//        log.warn("ResourceNotFoundException caught: {}", e.getMessage());
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//    }
//
//    /**
//     * Handles {@link DuplicateTransactionException} and returns an HTTP 409 Conflict status.
//     * This is typically used when an operation conflicts with the current state of a resource,
//     * for example, trying to initiate a payment that already exists or confirm an already confirmed transaction.
//     *
//     * @param e The DuplicateTransactionException instance.
//     * @return A ResponseEntity with HttpStatus.CONFLICT and the exception message.
//     */
//    @ExceptionHandler(DuplicateTransactionException.class)
//    public ResponseEntity<String> handleDuplicate(DuplicateTransactionException e) {
//        // Log the exception at WARN level, as it's an expected business-level error.
//        log.warn("DuplicateTransactionException caught: {}", e.getMessage());
//        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
//    }
//
//    /**
//     * Catches any other uncaught {@link Exception} and returns an HTTP 400 Bad Request status.
//     * This acts as a fallback for general unhandled exceptions, providing a consistent error response.
//     * It's important to log these at ERROR level as they indicate an unexpected issue.
//     *
//     * @param e The Exception instance.
//     * @return A ResponseEntity with HttpStatus.BAD_REQUEST and the exception message.
//     */
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleGeneral(Exception e) {
//        // Log the generic exception at ERROR level with stack trace for detailed debugging.
//        log.error("Unhandled exception occurred: {}", e.getMessage(), e);
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//    }
//}
package com.example.payment.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException e) {
        log.warn("ResourceNotFoundException caught: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(DuplicateTransactionException.class)
    public ResponseEntity<String> handleDuplicate(DuplicateTransactionException e) {
        log.warn("DuplicateTransactionException caught: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationErrors(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .findFirst()
            .orElse("Invalid input");
        log.warn("Validation error: {}", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleInvalidFormat(HttpMessageNotReadableException e) {
        log.warn("Invalid input format: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input format. Please check your request data.");
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<String> handleConstraintViolation(ConstraintViolationException e) {
        log.warn("Constraint violation: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation failed: " + e.getMessage());
    }

    @ExceptionHandler(InvalidInputFormatException.class)
    public ResponseEntity<String> handleInvalidInputFormat(InvalidInputFormatException e) {
        log.warn("InvalidInputFormatException caught: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception e) {
        log.error("Unhandled exception occurred: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}

