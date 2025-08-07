package com.delivery.delivery_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception indicating that an invalid status transition or value was provided.
 * When thrown, it typically results in an HTTP 400 Bad Request response.
 */

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidStatusException extends RuntimeException {
    public InvalidStatusException(String message){
        super(message);
    }
}
