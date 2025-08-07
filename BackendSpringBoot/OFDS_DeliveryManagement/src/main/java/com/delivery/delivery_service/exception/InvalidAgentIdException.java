package com.delivery.delivery_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception to be thrown when an invalid agent ID is provided.
 * This exception maps to an HTTP 400 Bad Request status by default.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidAgentIdException extends IllegalArgumentException {
    public InvalidAgentIdException(String message) {
        super(message);
    }

}
