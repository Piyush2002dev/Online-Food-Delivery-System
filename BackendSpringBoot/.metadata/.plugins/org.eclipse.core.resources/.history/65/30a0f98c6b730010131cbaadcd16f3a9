package com.example.payment.repository;

import com.example.payment.model.Payment;
import com.example.payment.model.PaymentMethod;
import com.example.payment.model.PaymentStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
 class PaymentRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Test
    void testRetrievePaymentByOrderId() {
        // Arrange
        Payment payment = Payment.builder()
                .orderId(1001L)
                .paymentMethod(PaymentMethod.Online)
                .paymentAmount(500.0)
                .paymentStatus(PaymentStatus.Success)
                .createdBy("TestUser")
                .build();
        paymentRepository.save(payment);

        // Act
        Optional<Payment> result = paymentRepository.findByOrderId(1001L);

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getOrderId()).isEqualTo(1001L);
        assertThat(result.get().getPaymentAmount()).isEqualTo(500.0);
        assertThat(result.get().getPaymentStatus()).isEqualTo(PaymentStatus.Success);
    }

    @Test
    void testRetrieveNonExistentPaymentByOrderId() {
        // Act
        Optional<Payment> result = paymentRepository.findByOrderId(9999L);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    void testSaveNewPayment() {
        // Arrange
        Payment payment = Payment.builder()
                .orderId(2002L)
                .paymentMethod(PaymentMethod.Card)
                .paymentAmount(750.0)
                .paymentStatus(PaymentStatus.Pending)
                .createdBy("Tester")
                .build();

        // Act
        Payment saved = paymentRepository.save(payment);
        Optional<Payment> result = paymentRepository.findByOrderId(2002L);

        // Assert
        assertThat(saved.getIdPayment()).isNotNull();
        assertThat(result).isPresent();
        assertThat(result.get().getPaymentStatus()).isEqualTo(PaymentStatus.Pending);
    }

    @Test
    void testDeleteExistingPayment() {
        // Arrange
        Payment payment = Payment.builder()
                .orderId(3003L)
                .paymentMethod(PaymentMethod.Cash)
                .paymentAmount(300.0)
                .paymentStatus(PaymentStatus.Failed)
                .createdBy("Admin")
                .build();
        paymentRepository.save(payment);

        // Act
        paymentRepository.delete(payment);
        Optional<Payment> result = paymentRepository.findByOrderId(3003L);

        // Assert
        assertThat(result).isEmpty();
    }
}
