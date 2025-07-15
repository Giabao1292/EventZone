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
public class SeatResponse {
    private String id;
    private Integer x;
    private Integer y;
    private String label;
    private String type;
    private BigDecimal price;
    private Integer capacity;
}
