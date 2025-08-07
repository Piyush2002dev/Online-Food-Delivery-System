package com.ofds.menu.exception;

public class InvalidRestaurantIdException extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidRestaurantIdException(String message) {
	       super(message);
	   }
}
