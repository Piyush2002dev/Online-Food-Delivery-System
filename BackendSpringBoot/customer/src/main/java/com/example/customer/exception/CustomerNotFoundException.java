//package com.example.Customer.exception;
//
//public class CustomerNotFoundException extends Exception {
//	private static final long serialVersionUID = 1L;
//
//	public CustomerNotFoundException(String message) {
//        super(message);
//    }
//}
package com.example.customer.exception;

/**
 * Exception thrown when a customer with the given ID or email is not found.
 */
public class CustomerNotFoundException extends Exception {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new CustomerNotFoundException with the specified message.
     *
     * @param message the detailed error message.
     */
    public CustomerNotFoundException(String message) {
        super(message);
    }
}
