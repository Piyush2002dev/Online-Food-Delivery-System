package com.ofds.menu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class OfdsMenuManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(OfdsMenuManagementApplication.class, args);
		
	}

}