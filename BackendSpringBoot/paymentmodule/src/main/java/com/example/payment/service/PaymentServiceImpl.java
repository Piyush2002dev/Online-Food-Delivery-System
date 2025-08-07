package com.example.payment.service;

import com.example.payment.dto.PaymentRequestDTO;
import com.example.payment.dto.PaymentResponseDTO;
import com.example.payment.exception.DuplicateTransactionException;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.exception.InvalidInputFormatException;
import com.example.payment.model.Payment;
import com.example.payment.model.PaymentStatus;
import com.example.payment.repository.PaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;

    public PaymentServiceImpl(PaymentRepository paymentRepository, ModelMapper modelMapper) {
        this.paymentRepository = paymentRepository;
        this.modelMapper = modelMapper;
        log.info("PaymentServiceImpl initialized.");
    }

    @Override
    public PaymentResponseDTO initiatePayment(PaymentRequestDTO requestDTO) throws InvalidInputFormatException {
        log.info("Initiating payment for order ID: {}", requestDTO.getOrderId());
        Optional<Payment> existingPayment = paymentRepository.findByOrderId(requestDTO.getOrderId());

        if (existingPayment.isPresent()) {
            log.warn("Payment already initiated for Order ID: {}. Throwing DuplicateTransactionException.", requestDTO.getOrderId());
            throw new DuplicateTransactionException("Payment already initiated for Order ID: " + requestDTO.getOrderId());
        }

        Payment payment = new Payment();
        payment.setOrderId(requestDTO.getOrderId());
        payment.setPaymentMethod(requestDTO.getPaymentMethod());
        payment.setPaymentAmount(requestDTO.getPaymentAmount());
        
        // ✅ Set payment status based on payment method
        if (requestDTO.getPaymentMethod() == com.example.payment.model.PaymentMethod.Cash) {
            // Cash on Delivery should be marked as Success immediately
            payment.setPaymentStatus(PaymentStatus.Success);
            log.info("Cash on Delivery payment marked as Success for order ID: {}", requestDTO.getOrderId());
        } else if (requestDTO.getPaymentMethod() == com.example.payment.model.PaymentMethod.Card) {
            // Card payments should be marked as Success immediately after processing
            payment.setPaymentStatus(PaymentStatus.Success);
            log.info("Card payment marked as Success for order ID: {}", requestDTO.getOrderId());
        } else {
            // Online payments start as Pending (for future online payment gateway integration)
            payment.setPaymentStatus(PaymentStatus.Pending);
            log.info("Online payment marked as Pending for order ID: {}", requestDTO.getOrderId());
        }
        
        payment.setCreatedBy(requestDTO.getCreatedBy());
        payment.setCreatedOn(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment initiated and saved with ID: {} for Order ID: {} with status: {}", 
                savedPayment.getOrderId(), savedPayment.getOrderId(), savedPayment.getPaymentStatus());
        return modelMapper.map(savedPayment, PaymentResponseDTO.class);
    }

    @Override
    public void confirmPayment(PaymentRequestDTO requestDTO) throws DuplicateTransactionException, ResourceNotFoundException, InvalidInputFormatException {
        log.info("Attempting to confirm payment for order ID: {}", requestDTO.getOrderId());

        Payment payment = paymentRepository.findByOrderId(requestDTO.getOrderId())
                .orElseThrow(() -> {
                    log.warn("Payment not found for order ID {} during confirmation.", requestDTO.getOrderId());
                    return new ResourceNotFoundException("Order ID not found: " + requestDTO.getOrderId());
                });

        if (PaymentStatus.Success.equals(payment.getPaymentStatus())) {
            log.warn("Transaction for order ID {} is already confirmed (Success status). Throwing DuplicateTransactionException.", requestDTO.getOrderId());
            throw new DuplicateTransactionException("Transaction already confirmed.");
        }

        payment.setPaymentStatus(PaymentStatus.Success);
        payment.setUpdatedBy(requestDTO.getCreatedBy());
        payment.setUpdatedOn(LocalDateTime.now());

        paymentRepository.save(payment);
        log.info("Payment confirmed successfully for order ID: {}", requestDTO.getOrderId());
    }

    @Override
    public PaymentResponseDTO getPaymentDetails(Long orderId) throws ResourceNotFoundException {
        log.info("Fetching payment details for order ID: {}", orderId);

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> {
                    log.warn("Payment not found for order ID {}.", orderId);
                    return new ResourceNotFoundException("Payment not found for order ID: " + orderId);
                });

        log.info("Payment details found for order ID: {}. Transaction ID: {}", orderId, payment.getOrderId());
        return modelMapper.map(payment, PaymentResponseDTO.class);
    }

    @Override
    public void deletePaymentByOrderId(Long orderId) throws ResourceNotFoundException {
        log.info("Attempting to delete payment for order ID: {}", orderId);

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> {
                    log.warn("Payment not found for deletion for order ID {}.", orderId);
                    return new ResourceNotFoundException("Payment not found for order ID: " + orderId);
                });

        paymentRepository.delete(payment);
        log.info("Payment record successfully deleted for order ID: {}", orderId);
    }
}