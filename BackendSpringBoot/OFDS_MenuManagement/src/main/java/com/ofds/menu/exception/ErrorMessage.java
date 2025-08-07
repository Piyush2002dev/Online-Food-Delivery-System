package com.ofds.menu.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorMessage {

	private int status;
	private String message;
	private LocalDateTime timeStamp;
	
}
