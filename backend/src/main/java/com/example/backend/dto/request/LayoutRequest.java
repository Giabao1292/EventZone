package com.example.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class LayoutRequest {
    private int showing_time_id;
    private String layout_mode;
    private List<SeatRequest> seats;
    private List<ZoneRequest> zones;
}
