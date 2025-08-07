//package com.example.Customer.exception;
//
//public class InvalidCredentialsException extends Exception{
//	private static final long serialVersionUID = 1L;
//
//	public InvalidCredentialsException(String message) {
//	        super(message);
//	    }
//}
package com.example.customer.exception;

/**
 * Exception thrown when authentication fails due to invalid credentials.
 */
public class InvalidCredentialsException extends Exception {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new InvalidCredentialsException with the specified message.
     *
     * @param message the detailed error message.
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
