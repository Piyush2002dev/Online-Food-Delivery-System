package com.example.payment.service;

import com.example.payment.dto.PaymentRequestDTO;
import com.example.payment.dto.PaymentResponseDTO;
import com.example.payment.exception.DuplicateTransactionException;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.exception.InvalidInputFormatException;

public interface PaymentService {

    PaymentResponseDTO initiatePayment(PaymentRequestDTO requestDTO) throws InvalidInputFormatException;

    void confirmPayment(PaymentRequestDTO requestDTO) throws DuplicateTransactionException, ResourceNotFoundException, InvalidInputFormatException;

    PaymentResponseDTO getPaymentDetails(Long orderId) throws ResourceNotFoundException;

    void deletePaymentByOrderId(Long orderId) throws ResourceNotFoundException;
}

