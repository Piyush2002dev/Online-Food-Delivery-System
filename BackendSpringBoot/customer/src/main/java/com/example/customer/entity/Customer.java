//package com.example.Customer.entity;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import lombok.*;
//@Entity
//@Table(name = "customers")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Customer {
//	   @Id
//	    @GeneratedValue(strategy = GenerationType.IDENTITY)
//	    private Long id;
//	 
//	    private String name;
//	 
//	    @Column(unique = true, nullable = false)
//	    private String email;
//	 
//	    private String password;
//	    private String phone;
//	    private String address;
//
//}
package com.example.customer.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity class representing a customer in the system.
 * Maps to the "customers" table in the database.
 */
@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    /** Unique identifier for the customer. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Name of the customer. */
    private String name;

    /** Email of the customer (must be unique and not null). */
    @Column(unique = true, nullable = false)
    private String email;

    /** Encrypted password for authentication. */
    private String password;

    /** Contact phone number of the customer. */
    private Long phone;

    /** Physical address of the customer. */
    private String address;

	
}
