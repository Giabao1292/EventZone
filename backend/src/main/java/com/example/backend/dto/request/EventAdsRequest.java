package com.example.backend.dto.request;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EventAdsRequest {

    @NotNull
    private Long eventId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    @Future
    private LocalDate endDate;

    @NotNull
    private Double totalPrice;
    @NotNull
    private String paymentMethod;

    @Pattern(
        regexp = "^(https?://.*|)$", 
        message = "Banner URL phải là URL hợp lệ hoặc để trống"
    )
    private String bannerImageUrl; // optional
}
