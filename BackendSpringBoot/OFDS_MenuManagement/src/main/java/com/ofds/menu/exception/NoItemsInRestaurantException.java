package com.ofds.menu.exception;

public class NoItemsInRestaurantException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public NoItemsInRestaurantException(String message) {
	       super(message);
	   }	
}
