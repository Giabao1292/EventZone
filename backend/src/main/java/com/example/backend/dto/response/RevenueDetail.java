package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDetail {
    private String bucket;
    private BigDecimal ads;
    private BigDecimal booking;
}
