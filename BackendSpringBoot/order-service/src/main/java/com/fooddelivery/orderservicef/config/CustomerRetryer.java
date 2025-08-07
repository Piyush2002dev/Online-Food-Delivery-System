package com.fooddelivery.orderservicef.config;
import feign.RetryableException;
import feign.Retryer;

class CustomRetryer implements Retryer {
    private int maxAttempts=3;
    private long backoff=1000;
    private int attempt = 1;

    public CustomRetryer() {

        // 3 retries, 1s backoff
        this.maxAttempts=3;
        this.backoff=1000;
    }

    @Override
    public void continueOrPropagate(RetryableException e) {
        if (attempt++ >= maxAttempts) throw e;
        try {
            Thread.sleep(backoff);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public Retryer clone() {
        return new CustomRetryer();
    }
}