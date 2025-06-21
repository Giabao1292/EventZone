package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class BookingConfirmRequest {
    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // Ví dụ: "CREDIT_CARD", "PAYPAL"
    private String paymentToken; // Token từ cổng thanh toán (Stripe, PayPal, v.v.)
    private String promoCode;
}
