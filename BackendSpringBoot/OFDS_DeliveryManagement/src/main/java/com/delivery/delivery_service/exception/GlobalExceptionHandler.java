package com.delivery.delivery_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Handles ResourceNotFoundException, returning a 404 Not Found status.
     *
     * @param ex The ResourceNotFoundException instance.
     * @param request The current web request.
     * @return A ResponseEntity with error details and HTTP 404 status.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles DuplicateAssignmentException, returning a 409 Conflict status.
     *
     * @param ex The DuplicateAssignmentException instance.
     * @param request The current web request.
     * @return A ResponseEntity with error details and HTTP 409 status.
     */
    @ExceptionHandler(DuplicateAssignmentException.class)
    public ResponseEntity<Object> handleDuplicateAssignmentException(
            DuplicateAssignmentException ex, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", "Conflict");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    /**
     * Handles InvalidStatusException, returning a 400 Bad Request status.
     *
     * @param ex The InvalidStatusException instance.
     * @param request The current web request.
     * @return A ResponseEntity with error details and HTTP 400 status.
     */
    @ExceptionHandler(InvalidStatusException.class)
    public ResponseEntity<Object> handleInvalidStatusException(
            InvalidStatusException ex, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }


    /**
     * NEW: Handles InvalidOrderIdException, returning a 400 Bad Request status.
     * @param ex The InvalidOrderIdException instance.
     * @param request The current web request.
     * @return A ResponseEntity with error details and HTTP 400 status.
     */
    @ExceptionHandler(InvalidOrderIdException.class)
    public ResponseEntity<Object> handleInvalidOrderIdException(
            InvalidOrderIdException ex, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * NEW: Handles InvalidAgentIdException, returning a 400 Bad Request status.
     * @param ex The InvalidAgentIdException instance.
     * @param request The current web request.
     * @return A ResponseEntity with error details and HTTP 400 status.
     */
    @ExceptionHandler(InvalidAgentIdException.class)
    public ResponseEntity<Object> handleInvalidAgentIdException(
            InvalidAgentIdException ex, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * Catches any other unexpected exceptions and returns a 500 Internal Server Error.
     *
     * @param ex The Exception instance.
     * @param request The current web request.
     * @return A ResponseEntity with error details and HTTP 500 status.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllUncaughtException(
            Exception ex, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "An unexpected error occurred: " + ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        // Log the exception for debugging purposes
        ex.printStackTrace();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}