package com.example.Restaurant.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity class representing a restaurant in the system.
 * Maps to the 'restaurants' table in the database.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "restaurants")

public class Restaurant {
    
    /** 
     * Unique identifier for the restaurant (Primary Key).
     * Auto-generated using IDENTITY strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 
     * Name of the restaurant (Required field).
     */
    @Column(nullable = false)
    private String name;

    /** 
     * Location of the restaurant (Unique and required field).
     */
    @Column(nullable = false)
    private String location;

    /** 
     * Email of the restaurant (Unique and required field).
     */
    @Column(unique = true, nullable = false)
    private String email;

    /** 
     * Password for authentication (Unique and required field).
     */
    @Column(unique = true, nullable = false)
    private String password;
}
