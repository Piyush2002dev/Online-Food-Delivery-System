
package com.example.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for customer registration.
 * Used to transfer customer registration data between client and server.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRegisterDTO {

    /** Full name of the customer. */
    private String name;

    /** Email address of the customer (must be unique). */
    private String email;

    /** Password for account authentication. */
    private String password;

    /** Contact phone number of the customer. */
    private Long phone;

    /** Physical address of the customer. */
    private String address;
}
