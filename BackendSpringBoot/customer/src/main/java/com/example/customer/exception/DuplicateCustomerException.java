//package com.example.Customer.exception;
//
//public class DuplicateCustomerException extends RuntimeException {
//	private static final long serialVersionUID = 1L;
//
//	public DuplicateCustomerException(String message) {
//        super(message);
//    }
//}
package com.example.customer.exception;

/**
 * Exception thrown when a customer with the given email already exists.
 */
public class DuplicateCustomerException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new DuplicateCustomerException with the specified message.
     *
     * @param message the detailed error message.
     */
    public DuplicateCustomerException(String message) {
        super(message);
    }
}
