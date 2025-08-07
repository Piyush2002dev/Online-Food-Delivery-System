package com.example.Restaurant.Exception;

/**
 * Custom exception for handling duplicate restaurant registrations.
 * Thrown when a restaurant with the same email already exists.
 */
public class DuplicateRestaurantException extends RuntimeException {
    
    /** 
     * Serial version UID for ensuring proper deserialization. 
     */
    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new DuplicateRestaurantException with a specified message.
     *
     * @param message The error message describing the issue.
     */
    public DuplicateRestaurantException(String message) {
        super(message);
    }
}
