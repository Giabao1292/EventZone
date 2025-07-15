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
public class ZoneResponse {
    private String id;
    private String name;
    private String type;
    private BigDecimal price;
    private Integer x;
    private Integer y;
    private Integer capacity;
    private Integer width;
    private Integer height;
}