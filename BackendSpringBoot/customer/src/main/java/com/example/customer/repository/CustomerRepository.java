//package com.example.Customer.repository;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.example.Customer.entity.Customer;
//
//import java.util.Optional;
//public interface CustomerRepository extends JpaRepository<Customer,Long>{
//	 Optional<Customer> findByEmail(String email);
//	    boolean existsByEmail(String email);
//}
package com.example.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.customer.entity.Customer;

import java.util.Optional;

/**
 * Repository interface for managing {@link Customer} entities.
 * Provides methods for querying customers based on their email.
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Finds a customer by their email.
     *
     * @param email the customer's email.
     * @return an {@link Optional} containing the found customer, or empty if none exists.
     */
    Optional<Customer> findByEmail(String email);

    /**
     * Checks if a customer exists with the given email.
     *
     * @param email the customer's email.
     * @return {@code true} if a customer exists, {@code false} otherwise.
     */
    boolean existsByEmail(String email);
}
