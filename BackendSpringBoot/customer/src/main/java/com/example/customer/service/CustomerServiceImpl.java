package com.example.customer.service;
import java.util.Collections;
import java.util.Optional;

import org.springframework.core.log.LogAccessor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.customer.dto.AuthResponseDTO;
import com.example.customer.dto.CustomerProfileDTO;
import com.example.customer.dto.CustomerRegisterDTO;
import com.example.customer.dto.CustomerUpdateDTO;
import com.example.customer.dto.UserAuthDetailsDTO;
import com.example.customer.entity.Customer;
import com.example.customer.exception.CustomerNotFoundException;
import com.example.customer.exception.DuplicateCustomerException;
import com.example.customer.repository.CustomerRepository;
import com.example.customer.util.AppConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of CustomerService interface that handles customer registration,
 * authentication, profile retrieval, and profile update functionalities.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

	
	
    private final CustomerRepository repository;
    private final PasswordEncoder passwordEncoder;
    
    
    
    /**
     * Registers a new customer.
     *
     * @param dto the customer registration details.
     * @return authentication response indicating successful registration.
     * @throws DuplicateCustomerException if the email is already registered.
     */
    @Override
    public AuthResponseDTO register(CustomerRegisterDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new DuplicateCustomerException(AppConstants.EMAIL_ALREADY_EXISTS);
        }
        
        log.info("Register Customer:{}",dto);
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPassword(passwordEncoder.encode(dto.getPassword()));
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());

        
        repository.save(customer);
        return new AuthResponseDTO(AppConstants.REGISTRATION_SUCCESS);
    }

    /**
     * Retrieves customer profile information by ID.
     *
     * @param id the unique identifier of the customer.
     * @return the customer's profile details.
     * @throws CustomerNotFoundException if no customer is found with the given ID.
     */
    @Override
    public CustomerProfileDTO getCustomerProfile(Long id) throws CustomerNotFoundException {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(AppConstants.CUSTOMER_NOT_FOUND));

        return new CustomerProfileDTO(
                customer.getId(),
                customer.getName(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getEmail()
        );
    }

    /**
     * Updates an existing customer profile.
     *
     * @param id  the unique identifier of the customer.
     * @param dto the updated customer details.
     * @return the updated customer profile.
     * @throws CustomerNotFoundException   if no customer exists with the provided ID.
     * @throws DuplicateCustomerException  if the updated email is already in use by another customer.
     */
    @Override
    public CustomerUpdateDTO updateCustomer(Long id, CustomerUpdateDTO dto) throws CustomerNotFoundException {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(AppConstants.CUSTOMER_NOT_FOUND));

        Optional<Customer> existingCustomer = repository.findByEmail(dto.getEmail());
        if (existingCustomer.isPresent() && !existingCustomer.get().getId().equals(id)) {
            throw new DuplicateCustomerException(AppConstants.DUPLICATE_CUSTOMER);
        }

        customer.setName(dto.getName());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setEmail(dto.getEmail());

        Customer updatedCustomer = repository.save(customer);

        return new CustomerUpdateDTO(
              //  updatedCustomer.getId(),
                updatedCustomer.getName(),
                updatedCustomer.getPhone(),
                updatedCustomer.getAddress(),
                updatedCustomer.getEmail()
        );
    }
    
    public Optional<UserAuthDetailsDTO> findUserAuthDetailsByIdentifier(String identifier) {
        log.info("Attempting to find customer auth details for identifier: {}", identifier);

        Optional<Customer> customerOptional = repository.findByEmail(identifier);
        log.info("{}",customerOptional);
        if (customerOptional.isEmpty()) {
            customerOptional = repository.findByEmail(identifier);
        }

        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            UserAuthDetailsDTO dto = new UserAuthDetailsDTO(
                    customer.getId(),
                    customer.getName(),
                    customer.getEmail(),
                    customer.getPassword(),
                    Collections.singletonList("CUSTOMER")
            );
            log.debug("Found customer auth details for identifier: {}", identifier);
            return Optional.of(dto);
        } else {
            log.warn("Customer auth details not found for identifier: {}", identifier);
            return Optional.empty();
        }
    }
}
