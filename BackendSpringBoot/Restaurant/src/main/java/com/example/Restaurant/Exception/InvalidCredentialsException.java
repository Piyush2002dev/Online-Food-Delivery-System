package com.example.Restaurant.Exception;

/**
 * Custom exception for handling invalid login credentials.
 * Thrown when a user provides incorrect email or password.
 */
public class InvalidCredentialsException extends RuntimeException {
    
    /** 
     * Serial version UID for ensuring proper deserialization. 
     */
    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new InvalidCredentialsException with a specified message.
     *
     * @param message The error message describing the issue.
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
