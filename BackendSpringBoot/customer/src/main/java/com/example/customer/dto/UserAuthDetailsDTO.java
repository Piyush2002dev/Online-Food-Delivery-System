package com.example.customer.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthDetailsDTO {

	private Long id;
    private String username;
    private String email;
    private String hashedPassword;
    private List<String> roles;
    
}
