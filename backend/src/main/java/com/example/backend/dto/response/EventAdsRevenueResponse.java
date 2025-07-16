package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class EventAdsRevenueResponse {

    private Integer eventAdsId;
    private String eventTitle;
    private String organizerName;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double totalPrice;
    private String paymentGateway;

    private String status;
    private String refundStatus;

    private LocalDateTime createdAt;
}