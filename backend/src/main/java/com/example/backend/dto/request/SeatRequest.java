package com.example.backend.dto.request;

import lombok.Data;

@Data
public class SeatRequest {
    private String label;
    private int x;
    private int y;
    private String type;
    private int price;
}
