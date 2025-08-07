
package com.example.payment.exception;

/**
 * Custom runtime exception to indicate that a requested resource (e.g., a payment, order)
 * could not be found. This typically maps to an HTTP 404 Not Found status.
 * Extending {@code RuntimeException} means it's an unchecked exception,
 * simplifying method signatures in calling code.
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     *
     * @param message The detail message explaining why the resource was not found.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}