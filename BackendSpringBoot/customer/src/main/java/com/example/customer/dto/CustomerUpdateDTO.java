//package com.example.Customer.dto;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class CustomerUpdateDTO {
//	private Long id;
//	private String name;
//    private String phone;
//    private String address;
//    private String email;
//
//}
package com.example.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for updating customer details.
 * Used to transfer customer update data between client and server.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerUpdateDTO {
	@NotBlank(message = "Name must not be blank")
    private String name;
 
    @NotNull(message = "Phone number must not be null")
    private Long phone;
 
    @NotBlank(message = "Address must not be blank")
    private String address;
 
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be blank")
    private String email;
 
}
