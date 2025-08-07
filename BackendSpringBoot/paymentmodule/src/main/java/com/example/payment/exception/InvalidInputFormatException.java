package com.example.payment.exception;

/**
 * Custom runtime exception to indicate that the input format is invalid.
 * This typically maps to an HTTP 400 Bad Request status.
 */
public class InvalidInputFormatException extends RuntimeException {

    public InvalidInputFormatException(String message) {
        super(message);
    }
}
