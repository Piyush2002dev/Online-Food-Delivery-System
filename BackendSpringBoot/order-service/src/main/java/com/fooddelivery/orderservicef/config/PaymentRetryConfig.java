package com.fooddelivery.orderservicef.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.backoff.FixedBackOffPolicy;
import org.springframework.retry.support.RetryTemplate;


@Configuration
public class PaymentRetryConfig {
    @Bean
    RetryTemplate retryTemplate() {
        RetryTemplate template = new RetryTemplate();
        FixedBackOffPolicy backOff = new FixedBackOffPolicy();
        backOff.setBackOffPeriod(1000); // 1 second delay
        template.setBackOffPolicy(backOff);
        return template;
    }
}