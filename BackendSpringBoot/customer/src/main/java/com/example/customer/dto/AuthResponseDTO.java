
package com.example.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for authentication responses.
 * Used to send messages indicating authentication success or failure.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    /** Message indicating authentication result (e.g., success or failure). */
    private String message;
}
