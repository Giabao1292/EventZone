package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class BookingResponseDTO {

    private Long bookingId;
    private String fullName;
    private String email;
    private String eventTitle;

    private LocalDateTime showingTime;
    private Integer numberOfSeats;
    private BigDecimal finalPrice;

    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paidAt;
}