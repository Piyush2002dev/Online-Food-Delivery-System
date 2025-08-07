package com.delivery.delivery_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception to be thrown when an invalid order ID is provided.
 * This exception maps to an HTTP 400 Bad Request status by default.
 */

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidOrderIdException extends IllegalArgumentException {
    public InvalidOrderIdException(String message) {
        super(message);
    }

}
