


package com.example.payment.exception;

/**
 * Custom runtime exception to indicate that a payment transaction
 * cannot be processed because it is a duplicate or has already been handled.
 * This extends {@code RuntimeException} so it does not need to be explicitly
 * caught (it's an unchecked exception), simplifying calling code.
 */
public class DuplicateTransactionException extends RuntimeException {

    /**
     * Constructs a new DuplicateTransactionException with the specified detail message.
     *
     * @param message The detail message (which can be retrieved by the {@link #getMessage()} method).
     */
    public DuplicateTransactionException(String message) {
        super(message);
    }
}