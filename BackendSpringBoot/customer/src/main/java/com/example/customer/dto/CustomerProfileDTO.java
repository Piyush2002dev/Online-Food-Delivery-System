package com.example.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for customer profile information.
 * Used to transfer customer profile details between client and server.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerProfileDTO {

    /** Unique identifier for the customer. */
    private Long id;

    /** Full name of the customer. */
    private String name;

    /** Contact phone number of the customer. */
    private Long phone;

    /** Physical address of the customer. */
    private String address;

    /** Email address of the customer. */
    private String email;


}
