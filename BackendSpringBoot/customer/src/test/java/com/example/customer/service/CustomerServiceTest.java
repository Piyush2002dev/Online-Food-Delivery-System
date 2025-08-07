package com.example.customer.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.customer.dto.AuthResponseDTO;
import com.example.customer.dto.CustomerProfileDTO;
import com.example.customer.dto.CustomerRegisterDTO;
import com.example.customer.dto.CustomerUpdateDTO;
import com.example.customer.entity.Customer;
import com.example.customer.exception.CustomerNotFoundException;
import com.example.customer.exception.DuplicateCustomerException;
import com.example.customer.exception.InvalidCredentialsException;
import com.example.customer.repository.CustomerRepository;
import com.example.customer.util.AppConstants;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository repository; 

    @InjectMocks
    private CustomerServiceImpl customerService; 

    private CustomerRegisterDTO registerDTO;
    private Customer existingCustomer;
    private CustomerUpdateDTO updateDTO;
    private Long customerId = 1L;
    private Long anotherCustomerId = 2L;

    @BeforeEach
    void setUp() {
        registerDTO = new CustomerRegisterDTO("John Doe", "john.doe@example.com", "password123", 1234567890L, "123 Main St");
        existingCustomer = new Customer(customerId, "John Doe", "john.doe@example.com", "password123", 1234567890L, "123 Main St");
        updateDTO = new CustomerUpdateDTO("Updated Name", 9998887777L, "Updated Address", "updated.email@example.com");
    }



    // Test Case 1: Successfully register a new customer. 
    @Test
    void testRegister_Success() {
        // Mock behavior: Email does not exist
        when(repository.existsByEmail(registerDTO.getEmail())).thenReturn(false);
        // Mock save operation (return the customer, potentially with an ID)
        when(repository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer customer = invocation.getArgument(0);
            customer.setId(1L); // Simulate ID being set by DB 
            return customer;
        });
        AuthResponseDTO response = customerService.register(registerDTO);
        assertNotNull(response);
        assertEquals(AppConstants.REGISTRATION_SUCCESS, response.getMessage());
        verify(repository, times(1)).existsByEmail(registerDTO.getEmail());
        verify(repository, times(1)).save(any(Customer.class));
    }

    // Test Case 2: Throw DuplicateCustomerException for existing email.
    @Test
    void testRegister_ExistingEmailThrowsDuplicateCustomerException() {
        // Mock behavior: Email already exists
        when(repository.existsByEmail(registerDTO.getEmail())).thenReturn(true);
        DuplicateCustomerException thrown = assertThrows(
            DuplicateCustomerException.class,
            () -> customerService.register(registerDTO),
            "Should throw DuplicateCustomerException"
        );

        assertEquals(AppConstants.EMAIL_ALREADY_EXISTS, thrown.getMessage());
        verify(repository, times(1)).existsByEmail(registerDTO.getEmail());
        verify(repository, never()).save(any(Customer.class)); 
    }

    // Test Case 3: Ensure customerRepository.save() is invoked once with correct data.
    @Test
    void testRegister_SaveInvokedWithCorrectData() {
        when(repository.existsByEmail(registerDTO.getEmail())).thenReturn(false);
        // Mock save to return the customer (with an ID)
        when(repository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer customer = invocation.getArgument(0);
            customer.setId(1L);
            return customer;
        });

        customerService.register(registerDTO);
 
        // Assert: Capture the argument passed to save and verify its properties
        ArgumentCaptor<Customer> customerCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(repository, times(1)).save(customerCaptor.capture());

        Customer savedCustomer = customerCaptor.getValue();
        assertEquals(registerDTO.getName(), savedCustomer.getName());
        assertEquals(registerDTO.getEmail(), savedCustomer.getEmail());
        assertEquals(registerDTO.getPassword(), savedCustomer.getPassword()); 
        assertEquals(registerDTO.getPhone(), savedCustomer.getPhone());
        assertEquals(registerDTO.getAddress(), savedCustomer.getAddress());
        verify(repository, times(1)).existsByEmail(registerDTO.getEmail());
    }

    // Test Case 1: Successfully retrieve an existing customer's profile.
    @Test
    void testGetCustomerProfile_Success() throws CustomerNotFoundException {
        when(repository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
        CustomerProfileDTO result = customerService.getCustomerProfile(customerId);
        assertNotNull(result);
        assertEquals(existingCustomer.getId(), result.getId());
        assertEquals(existingCustomer.getName(), result.getName());
        assertEquals(existingCustomer.getEmail(), result.getEmail());
        assertEquals(existingCustomer.getPhone(), result.getPhone());
        assertEquals(existingCustomer.getAddress(), result.getAddress());
        verify(repository, times(1)).findById(customerId);
    }

    // Test Case 2: Throw CustomerNotFoundException for a non-existent ID.
    @Test
    void testGetCustomerProfile_NonExistentIdThrowsCustomerNotFoundException() {
     
        when(repository.findById(customerId)).thenReturn(Optional.empty());
        CustomerNotFoundException thrown = assertThrows(
            CustomerNotFoundException.class,
            () -> customerService.getCustomerProfile(customerId),
            "Should throw CustomerNotFoundException"
        );
        assertEquals(AppConstants.CUSTOMER_NOT_FOUND, thrown.getMessage());
        verify(repository, times(1)).findById(customerId);
    }


    // Test Case 1: Successfully update an existing customer's profile.
    @Test
    void testUpdateCustomer_Success() throws CustomerNotFoundException {
        Customer customerBeforeUpdate = new Customer(customerId, "Original Name", "original@example.com", "password123", 1112223333L, "Original Address");
        updateDTO.setEmail("new.unique@example.com"); // Set a new, unique email for this test
        
        when(repository.findById(customerId)).thenReturn(Optional.of(customerBeforeUpdate));
        when(repository.findByEmail(updateDTO.getEmail())).thenReturn(Optional.empty()); 
        when(repository.save(any(Customer.class))).thenAnswer(invocation -> 
            invocation.getArgument(0)); 
        CustomerUpdateDTO result = customerService.updateCustomer(customerId, updateDTO);
        assertNotNull(result);
        assertEquals(updateDTO.getName(), result.getName());
        assertEquals(updateDTO.getEmail(), result.getEmail());
        assertEquals(updateDTO.getPhone(), result.getPhone());
        assertEquals(updateDTO.getAddress(), result.getAddress());
        verify(repository, times(1)).findById(customerId);
        verify(repository, times(1)).findByEmail(updateDTO.getEmail());
        verify(repository, times(1)).save(any(Customer.class));
    }

    // Test Case for updating with the same email (should not throw duplicate)
    @Test
    void testUpdateCustomer_WithSameEmail_Success() throws CustomerNotFoundException {
        CustomerUpdateDTO sameEmailUpdateDTO = new CustomerUpdateDTO("Updated Name", 9998887777L, "Updated Address", 
        		existingCustomer.getEmail());
        
        when(repository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
        when(repository.findByEmail(sameEmailUpdateDTO.getEmail())).thenReturn(Optional.of(existingCustomer)); 
        
        when(repository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));
        CustomerUpdateDTO result = customerService.updateCustomer(customerId, sameEmailUpdateDTO);
        assertNotNull(result);
        assertEquals(sameEmailUpdateDTO.getName(), result.getName());
        assertEquals(sameEmailUpdateDTO.getEmail(), result.getEmail());
        assertEquals(sameEmailUpdateDTO.getPhone(), result.getPhone());
        assertEquals(sameEmailUpdateDTO.getAddress(), result.getAddress());
        verify(repository, times(1)).findById(customerId);
        verify(repository, times(1)).findByEmail(sameEmailUpdateDTO.getEmail());
        verify(repository, times(1)).save(any(Customer.class));
    }


    // Test Case 2: Throw CustomerNotFoundException for a non-existent ID during update.
    @Test
    void testUpdateCustomer_NonExistentIdThrowsCustomerNotFoundException() {
        when(repository.findById(customerId)).thenReturn(Optional.empty());
        CustomerNotFoundException thrown = assertThrows(
            CustomerNotFoundException.class,
            () -> customerService.updateCustomer(customerId, updateDTO),
            "Should throw CustomerNotFoundException"
        );

        assertEquals(AppConstants.CUSTOMER_NOT_FOUND, thrown.getMessage());
        verify(repository, times(1)).findById(customerId);
        verify(repository, never()).findByEmail(anyString()); 
        verify(repository, never()).save(any(Customer.class)); 
    }

    // Test Case for DuplicateCustomerException when updating email to one used by another customer
    @Test
    void testUpdateCustomer_DuplicateEmailByAnotherCustomerThrowsDuplicateCustomerException() {
        // Arrange
        Customer anotherCustomer = new Customer(anotherCustomerId, "Another User", updateDTO.getEmail(), "somepass", 
        		9876543210L, "Another Address");
        
        when(repository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
        when(repository.findByEmail(updateDTO.getEmail())).thenReturn(Optional.of(anotherCustomer)); 
        DuplicateCustomerException thrown = assertThrows(
            DuplicateCustomerException.class,
            () -> customerService.updateCustomer(customerId, updateDTO),
            "Should throw DuplicateCustomerException for duplicate email"
        );

        assertEquals(AppConstants.DUPLICATE_CUSTOMER, thrown.getMessage());

        // Verify interactions
        verify(repository, times(1)).findById(customerId);
        verify(repository, times(1)).findByEmail(updateDTO.getEmail());
        verify(repository, never()).save(any(Customer.class)); // Save should not be called
    }


    // Test Case 3: Ensure customerRepository.save() is invoked once with correct updated data.
    @Test
    void testUpdateCustomer_SaveInvokedWithCorrectData() throws CustomerNotFoundException {
        when(repository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
        // Mock that the updated email is unique or belongs to the current customer
        when(repository.findByEmail(updateDTO.getEmail())).thenReturn(Optional.empty()); 
        
        when(repository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0)); // Simulate save
        customerService.updateCustomer(customerId, updateDTO);

        // Assert: Capture the argument passed to save and verify its updated properties
        ArgumentCaptor<Customer> customerCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(repository, times(1)).save(customerCaptor.capture());

        Customer savedCustomer = customerCaptor.getValue();
        assertEquals(customerId, savedCustomer.getId()); // ID should remain the same
        assertEquals(updateDTO.getName(), savedCustomer.getName());
        assertEquals(updateDTO.getEmail(), savedCustomer.getEmail());
        assertEquals(updateDTO.getPhone(), savedCustomer.getPhone());
        assertEquals(updateDTO.getAddress(), savedCustomer.getAddress());
        assertEquals(existingCustomer.getPassword(), savedCustomer.getPassword());
        verify(repository, times(1)).findById(customerId);
        verify(repository, times(1)).findByEmail(updateDTO.getEmail());
    }
}

   