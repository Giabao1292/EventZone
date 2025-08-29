package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopClientResponse {
    private String fullName;
    private String email;
    private String profileUrl;
    private Integer numberOfBookings;
    private BigDecimal expenditure;
    private Integer status;
}
