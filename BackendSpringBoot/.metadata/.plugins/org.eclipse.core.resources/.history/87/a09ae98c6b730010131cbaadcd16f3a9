package com.example.payment.controller;

import com.example.payment.dto.PaymentRequestDTO;
import com.example.payment.dto.PaymentResponseDTO;
import com.example.payment.exception.DuplicateTransactionException;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.model.PaymentMethod;
import com.example.payment.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
@Import(PaymentControllerTest.PaymentServiceTestConfig.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PaymentService paymentService;

    private PaymentRequestDTO paymentRequestDTO;
    private PaymentResponseDTO paymentResponseDTO;

    @TestConfiguration
    static class PaymentServiceTestConfig {
        @Bean
        public PaymentService paymentService() {
            return mock(PaymentService.class);
        }
    }

    @BeforeEach
    void setUp() {
        paymentRequestDTO = new PaymentRequestDTO();
        paymentRequestDTO.setOrderId(1L);
        paymentRequestDTO.setPaymentMethod(PaymentMethod.Card);
        paymentRequestDTO.setPaymentAmount(new java.math.BigDecimal("100.0"));
        paymentRequestDTO.setCreatedBy("user");

        paymentResponseDTO = new PaymentResponseDTO();
        paymentResponseDTO.setOrderId(1L);
        paymentResponseDTO.setPaymentMethod(PaymentMethod.Card);
        paymentResponseDTO.setPaymentAmount(new java.math.BigDecimal("100.0"));
        paymentResponseDTO.setPaymentStatus("Pending");
    }

    @Test
    void testInitiatePaymentSuccess() throws Exception {
        when(paymentService.initiatePayment(any(PaymentRequestDTO.class)))
                .thenReturn(paymentResponseDTO);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/payments/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"paymentMethod\":\"Card\",\"paymentAmount\":100.0,\"createdBy\":\"user\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.paymentMethod").value("Card"))
                .andExpect(jsonPath("$.paymentAmount").value(100.0))
                .andExpect(jsonPath("$.paymentStatus").value("Pending"));
    }

    @Test
    void testInitiatePaymentDuplicate() throws Exception {
        when(paymentService.initiatePayment(any(PaymentRequestDTO.class)))
                .thenThrow(new DuplicateTransactionException("Payment already initiated for Order ID: 1"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/payments/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"paymentMethod\":\"Card\",\"paymentAmount\":100.0,\"createdBy\":\"user\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void testInitiatePaymentInvalidRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/payments/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":\"abc123\",\"paymentMethod\":\"Card\",\"paymentAmount\":100.0,\"createdBy\":\"user\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testConfirmPaymentSuccess() throws Exception {
        doNothing().when(paymentService).confirmPayment(any(PaymentRequestDTO.class));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/payments/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"paymentMethod\":\"Card\",\"paymentAmount\":100.0,\"createdBy\":\"user\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testConfirmPaymentDuplicate() throws Exception {
        doThrow(new DuplicateTransactionException("Transaction already confirmed."))
                .when(paymentService).confirmPayment(any(PaymentRequestDTO.class));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/payments/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"paymentMethod\":\"Card\",\"paymentAmount\":100.0,\"createdBy\":\"user\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void testConfirmPaymentNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Order ID not found: 1"))
                .when(paymentService).confirmPayment(any(PaymentRequestDTO.class));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/payments/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"paymentMethod\":\"Card\",\"paymentAmount\":100.0,\"createdBy\":\"user\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetPaymentDetailsSuccess() throws Exception {
        when(paymentService.getPaymentDetails(anyLong()))
                .thenReturn(paymentResponseDTO);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/payments/order/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.paymentMethod").value("Card"))
                .andExpect(jsonPath("$.paymentAmount").value(100.0))
                .andExpect(jsonPath("$.paymentStatus").value("Pending"));
    }

    @Test
    void testGetPaymentDetailsNotFound() throws Exception {
        when(paymentService.getPaymentDetails(anyLong()))
                .thenThrow(new ResourceNotFoundException("Payment not found for order ID: 1"));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/payments/order/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeletePaymentSuccess() throws Exception {
        doNothing().when(paymentService).deletePaymentByOrderId(anyLong());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/payments/order/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testDeletePaymentNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Payment not found for order ID: 1"))
                .when(paymentService).deletePaymentByOrderId(anyLong());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/payments/order/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}

