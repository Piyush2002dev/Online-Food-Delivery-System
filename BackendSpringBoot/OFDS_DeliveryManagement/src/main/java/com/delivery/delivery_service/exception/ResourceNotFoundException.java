package com.delivery.delivery_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for resources not found (e.g., Order, Agent, Delivery ID).
 * This will automatically map to HTTP 404 Not Found.
 **/

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }
}
