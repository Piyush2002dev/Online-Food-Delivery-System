package com.example.customer.util;

public class AppConstants {
	  public static final String REGISTRATION_SUCCESS = "customer registered successfully";
	   public static final String LOGIN_SUCCESS = "Login successfull";
	   public static final String INVALID_CREDENTIALS = "Invalid email or password";
	   public static final String EMAIL_ALREADY_EXISTS = "Email already exists!!";
	   public static final String CUSTOMER_NOT_FOUND = "customer not found";
	   public static final String DUPLICATE_CUSTOMER = "Email already registered by another customer";
	   public static final String EMAIL_AND_PASSWORD_EMPTY="Email and password must not be empty";
	   public static final String EMAIL_EMPTY="Email must not be empty";
	   public static final String PASSWORD_EMPTY="Password must not be empty";
	   public static final String ERROR_MESSAGE_KEY="message";
	   private AppConstants() {
		   throw new UnsupportedOperationException("Utility class cannot be instantiated");
	   }
}
