package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatDTO {
    private Integer id;
    private String seatLabel;
    private String type;
    private BigDecimal price;
    private Integer x;
    private Integer y;
    private boolean available;
}

