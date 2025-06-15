package com.example.backend.dto.request;

import lombok.Data;

@Data
public class ZoneRequest {
    private String name;
    private int x;
    private int y;
    private int width;
    private int height;
    private String type;
    private int price;
    private int capacity;
}
