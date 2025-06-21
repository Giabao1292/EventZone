package com.example.backend.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class HoldResponse {
    private Long bookingId;
    private BigDecimal totalPrice;
    private List<SeatInfo> seats;
    private List<ZoneInfo> zones;

    // Getters & Setters
}

class SeatInfo {
    private Long seatId;
    private String label;
    private BigDecimal price;

    // Getters & Setters
}

class ZoneInfo {
    private Long zoneId;
    private String zoneName;
    private Integer quantity;
    private BigDecimal totalPrice;

    // Getters & Setters
}