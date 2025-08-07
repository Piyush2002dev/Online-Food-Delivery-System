package com.example.customer.controller;

import static org.hamcrest.CoreMatchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.customer.dto.AuthResponseDTO;
import com.example.customer.dto.CustomerProfileDTO;
import com.example.customer.dto.CustomerRegisterDTO;
import com.example.customer.dto.CustomerUpdateDTO;
import com.example.customer.exception.CustomerNotFoundException;
import com.example.customer.exception.DuplicateCustomerException;
import com.example.customer.service.CustomerService;
import com.example.customer.util.AppConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
@WebMvcTest(CustomerController.class)
class CustomerControllerTest {
 
	 @Autowired
	    private MockMvc mockMvc;
	 
	    @SuppressWarnings("removal")
		@MockBean
	    private CustomerService customerService;
	 
	    private ObjectMapper objectMapper = new ObjectMapper();
	
	    @Test
	    void testRegisterCustomer_Success() throws Exception {
	        CustomerRegisterDTO dto = new CustomerRegisterDTO("Vyshnavi", "vysh@example.com", "123456", 9876543210L, "Hyderabad");
	        AuthResponseDTO response = new AuthResponseDTO(AppConstants.REGISTRATION_SUCCESS);
	     
	        when(customerService.register(any(CustomerRegisterDTO.class))).thenReturn(response);
	     
	        mockMvc.perform(post("/api/customers/register")
	                .contentType(MediaType.APPLICATION_JSON)
	                .content(objectMapper.writeValueAsString(dto)))
	                .andExpect(status().isOk())
	                .andExpect(jsonPath("$.message").value(AppConstants.REGISTRATION_SUCCESS));
	    }
	 
	    @Test
	    void testRegisterCustomer_DuplicateEmail() throws Exception {
	        CustomerRegisterDTO dto = new CustomerRegisterDTO("Vyshnavi", "vysh@example.com", "123456", 9876543210L, "Hyderabad");
	     
	        when(customerService.register(any(CustomerRegisterDTO.class)))
	                .thenThrow(new DuplicateCustomerException(AppConstants.EMAIL_ALREADY_EXISTS));
	     
	        mockMvc.perform(post("/api/customers/register")
	                .contentType(MediaType.APPLICATION_JSON)
	                .content(objectMapper.writeValueAsString(dto)))
	                .andExpect(status().isConflict())
	                .andExpect(jsonPath("$.message").value(AppConstants.EMAIL_ALREADY_EXISTS));
	    }
	    @Test
	    void testRegisterCustomer_MissingName() throws Exception {
	        CustomerRegisterDTO dto = new CustomerRegisterDTO("", "vysh@example.com", "123456", 9876543210L, "Hyderabad");
	     
	        mockMvc.perform(post("/api/customers/register")
	                .contentType(MediaType.APPLICATION_JSON)
	                .content(objectMapper.writeValueAsString(dto)))
	                .andExpect(status().isBadRequest())
	                .andExpect(jsonPath("$.name").value("Name must not be empty")); 
	    }

	   
	    @Test
	    void testGetCustomerProfile_Success() throws Exception {
	        CustomerProfileDTO profile = new CustomerProfileDTO(1L, "Vyshnavi", 9876543210L, "Vijayawada", "vyshu@example.com");
	     
	        when(customerService.getCustomerProfile(1L)).thenReturn(profile);
	     
	        mockMvc.perform(get("/api/customers/1"))
	            .andExpect(status().isOk())
	            .andExpect(jsonPath("$.id").value(1L))
	            .andExpect(jsonPath("$.name").value("Vyshnavi"))
	            .andExpect(jsonPath("$.email").value("vyshu@example.com"))
	            .andExpect(jsonPath("$.address").value("Vijayawada"))
	            .andExpect(jsonPath("$.phone").value(9876543210L));
	     
	        verify(customerService, times(1)).getCustomerProfile(1L);
	    }
	    @Test
	    void testGetCustomerProfile_CustomerNotFound() throws Exception {
	        when(customerService.getCustomerProfile(999L))
	            .thenThrow(new CustomerNotFoundException("Customer not found with ID: 999"));
	     
	        mockMvc.perform(get("/api/customers/999"))
	            .andExpect(status().isNotFound())
	            .andExpect(content().string(containsString("Customer not found with ID: 999")));
	     
	        verify(customerService, times(1)).getCustomerProfile(999L);
	    }
	    @Test
	    void testUpdateCustomerProfile_Success() throws Exception {
	        CustomerUpdateDTO dto = new CustomerUpdateDTO("Vysh", 9876543210L, "Hyd", "vysh@example.com");
	        CustomerUpdateDTO updated = new CustomerUpdateDTO("Vysh", 9876543210L, "Vijayawada", "vysh@example.com");
	     
	        when(customerService.updateCustomer(eq(1L), any(CustomerUpdateDTO.class))).thenReturn(updated);
	     
	        mockMvc.perform(put("/api/customers/1")
	                .contentType(MediaType.APPLICATION_JSON)
	                .content(objectMapper.writeValueAsString(dto)))
	            .andExpect(status().isOk())
	            .andExpect(jsonPath("$.name").value("Vysh"))
	            .andExpect(jsonPath("$.address").value("Vijayawada"))
	            .andExpect(jsonPath("$.email").value("vysh@example.com"))
	            .andExpect(jsonPath("$.phone").value(9876543210L));
	    }
	    @Test
	    void testUpdateCustomerProfile_InvalidData_BadRequest() throws  Exception {
	        CustomerUpdateDTO dto = new CustomerUpdateDTO("", 9876543210L, "Hyd", "vysh@example.com"); // name is empty
	     
	        mockMvc.perform(put("/api/customers/1")
	                .contentType(MediaType.APPLICATION_JSON)
	               .content(objectMapper.writeValueAsString(dto)))
	            .andExpect(status().isBadRequest())
	            .andExpect(jsonPath("$.name").exists()); // Customize this based on your exception handler
	    }
	    @Test
	    void testUpdateCustomerProfile_CustomerNotFound() throws Exception { 
	        Long customerId = 999L;
	        CustomerUpdateDTO dto = new CustomerUpdateDTO("Test", 9876543210L, "City", "test@example.com");
	     
	        when(customerService.updateCustomer(eq(customerId), any(CustomerUpdateDTO.class)))
	            .thenThrow(new CustomerNotFoundException("Customer not found with ID: " + customerId));
	     
	        mockMvc.perform(put("/api/customers/" + customerId)
	                .contentType(MediaType.APPLICATION_JSON)
	                .content(objectMapper.writeValueAsString(dto)))
	            .andExpect(status().isNotFound())
	            .andExpect(jsonPath("$.message").value("Customer not found with ID: " + customerId));
	    }
	     
	}
