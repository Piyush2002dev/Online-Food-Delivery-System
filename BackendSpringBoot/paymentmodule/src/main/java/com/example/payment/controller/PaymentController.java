package com.example.payment.controller;

import com.example.payment.dto.PaymentRequestDTO;
import com.example.payment.dto.PaymentResponseDTO;
import com.example.payment.dto.PaymentConfirmDTO;
import com.example.payment.exception.DuplicateTransactionException;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.exception.InvalidInputFormatException;
import com.example.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
        log.info("PaymentController initialized.");
    }

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponseDTO> initiatePayment(@Valid @RequestBody PaymentRequestDTO requestDTO) {
        log.info("Initiating payment for order ID: {}", requestDTO.getOrderId());
        try {
            PaymentResponseDTO responseDTO = paymentService.initiatePayment(requestDTO);
            log.info("Payment initiated, transaction ID: {}", responseDTO.getTransactionId());
            return ResponseEntity.ok(responseDTO);
        } catch (InvalidInputFormatException e) {
            log.warn("Invalid input for payment initiation: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (DuplicateTransactionException e) {
            log.warn("Duplicate transaction detected: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            log.error("Failed to initiate payment for order ID {}: {}", requestDTO.getOrderId(), e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> confirmPayment(@Valid @RequestBody PaymentRequestDTO requestDTO) {
        log.info("Confirming payment for order ID: {}", requestDTO.getOrderId());
        try {
            paymentService.confirmPayment(requestDTO);
            log.info("Payment confirmed for order ID: {}", requestDTO.getOrderId());
            return ResponseEntity.ok().build();
        } catch (InvalidInputFormatException e) {
            log.warn("Invalid input for payment confirmation: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (DuplicateTransactionException e) {
            log.warn("Transaction already confirmed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (ResourceNotFoundException e) {
            log.warn("Payment not found for confirmation: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error confirming payment for order ID {}: {}", requestDTO.getOrderId(), e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentDetails(@PathVariable Long orderId) {
        log.info("Fetching payment details for order ID: {}", orderId);
        try {
            PaymentResponseDTO responseDTO = paymentService.getPaymentDetails(orderId);
            log.info("Payment details retrieved for order ID: {}", orderId);
            return ResponseEntity.ok(responseDTO);
        } catch (ResourceNotFoundException e) {
            log.warn("Payment not found for order ID {}: {}", orderId, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving payment for order ID {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<String> deletePayment(@PathVariable Long orderId) {
        log.info("Deleting payment for order ID: {}", orderId);
        try {
            paymentService.deletePaymentByOrderId(orderId);
            log.info("Payment record deleted for order ID: {}", orderId);
            return ResponseEntity.ok("OrderId :" + orderId + " deleted successfully.");
        } catch (ResourceNotFoundException e) {
            log.warn("Attempted to delete non-existent payment for order ID {}: {}", orderId, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting payment for order ID {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }
}
