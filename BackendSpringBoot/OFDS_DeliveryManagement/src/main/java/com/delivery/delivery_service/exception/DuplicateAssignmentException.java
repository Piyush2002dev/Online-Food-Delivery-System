package com.delivery.delivery_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for duplicate delivery assignments.
 * This will automatically map to HTTP 409 Conflict.
 **/

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateAssignmentException extends RuntimeException{
    public DuplicateAssignmentException(String message){
        super(message);
    }
}
