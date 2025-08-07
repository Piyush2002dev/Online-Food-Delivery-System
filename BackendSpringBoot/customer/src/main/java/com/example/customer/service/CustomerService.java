//package com.example.Customer.service;
//import com.example.Customer.dto.*;
//import com.example.Customer.exception.CustomerNotFoundException;
//import com.example.Customer.exception.InvalidCredentialsException;
//
//public interface CustomerService {
//	 AuthResponseDTO register(CustomerRegisterDTO dto);
//	    AuthResponseDTO login(CustomerLoginDTO dto) throws InvalidCredentialsException;
//	    CustomerProfileDTO getCustomerProfile(Long id) throws CustomerNotFoundException;
//	    CustomerUpdateDTO updateCustomer(Long id, CustomerUpdateDTO dto) throws CustomerNotFoundException;
//		//CustomerUpdateDTO updateCustomer(Long id) throws CustomerNotFoundException;
//	
//	
//}
package com.example.customer.service;

import java.util.Optional;

import com.example.customer.dto.AuthResponseDTO;
import com.example.customer.dto.CustomerProfileDTO;
import com.example.customer.dto.CustomerRegisterDTO;
import com.example.customer.dto.CustomerUpdateDTO;
import com.example.customer.dto.UserAuthDetailsDTO;
import com.example.customer.exception.CustomerNotFoundException;

/**
 * Service interface defining customer-related operations.
 */
public interface CustomerService {

    /**
     * Registers a new customer.
     *
     * @param dto the customer registration details.
     * @return authentication response indicating successful registration.
     */
  AuthResponseDTO register(CustomerRegisterDTO dto);

    /*
     * Retrieves customer profile information by ID.
     *
     * @param id the unique identifier of the customer.
     * @return the customer's profile details.
     * @throws CustomerNotFoundException if no customer is found with the given ID.
     */
    CustomerProfileDTO getCustomerProfile(Long id) throws CustomerNotFoundException;

    /**
     * Updates an existing customer profile.
     *
     * @param id  the unique identifier of the customer.
     * @param dto the updated customer details.
     * @return the updated customer profile.
     * @throws CustomerNotFoundException if no customer exists with the provided ID.
     */
    CustomerUpdateDTO updateCustomer(Long id, CustomerUpdateDTO dto) throws CustomerNotFoundException;
    
    Optional<UserAuthDetailsDTO> findUserAuthDetailsByIdentifier(String identifier);
}
