package com.ofds.menu.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(DuplicateMenuItemException.class)
	public ResponseEntity<ErrorMessage> handleDuplicateMenuItemException(DuplicateMenuItemException ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.CONFLICT.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(MenuItemNotFoundException.class)
	public ResponseEntity<ErrorMessage> handleMenuItemNotFoundException(MenuItemNotFoundException ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.NOT_FOUND.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(NoItemsInRestaurantException.class)
	public ResponseEntity<ErrorMessage> handleNoItemsInRestaurantException(NoItemsInRestaurantException ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.NOT_FOUND.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(InvalidRestaurantIdException.class)
	public ResponseEntity<ErrorMessage> handleInvalidRestaurantIdException(InvalidRestaurantIdException ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(InvalidItemNameException.class)
	public ResponseEntity<ErrorMessage> handleInvalidItemNameException(InvalidItemNameException ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(InvalidItemIdException.class)
	public ResponseEntity<ErrorMessage> handleInvalidItemIdException(InvalidItemIdException ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(InvalidCategoryException.class)
	public ResponseEntity<ErrorMessage> handleInvalidCategoryException(InvalidCategoryException ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String,String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
		Map<String,String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach((error)->{
			String fieldName = ((FieldError)error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);});
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ErrorMessage> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex){
		ErrorMessage error = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ErrorMessage> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex){
		ErrorMessage error = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String propertyPath = violation.getPropertyPath().toString();
            String fieldName = propertyPath;
            int lastDotIndex = propertyPath.lastIndexOf('.');
            if (lastDotIndex != -1) {
                fieldName = propertyPath.substring(lastDotIndex + 1);
            }
            errors.put(fieldName, violation.getMessage());
        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorMessage> handleGeneralException(Exception ex) {
		ErrorMessage error = new ErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong: " + ex.getMessage(), LocalDateTime.now());
		return new ResponseEntity<>(error,HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
