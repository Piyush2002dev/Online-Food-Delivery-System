package com.example.Restaurant.Util;

public class AppConstants {
	
   public static final String REGISTRATION_SUCCESS = "Restaurant registered successfully";
   public static final String LOGIN_SUCCESS = "Login successful";
   public static final String INVALID_CREDENTIALS = "Invalid email or password";
   public static final String EMAIL_ALREADY_EXISTS = "Email already exists!!";
   public static final String RESTAURANT_NOT_FOUND = "Restaurant not found with ID: "; 
   
   private AppConstants() {
	   throw new UnsupportedOperationException("Utilty class cannot be instantiated");
   }
}