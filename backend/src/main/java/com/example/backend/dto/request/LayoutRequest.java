package com.example.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LayoutRequest {
    /**
     * ID của suất chiếu (snake_case từ frontend)
     */
    @JsonProperty("showing_time_id")
    private Integer showingTimeId;

    /**
     * Chế độ layout: "seat", "zone" hoặc "both"
     */
    @JsonProperty("layout_mode")
    private String layoutMode;

    /**
     * Danh sách ghế (SeatRequest)
     */
    private List<SeatRequest> seats;

    /**
     * Danh sách khu vực (ZoneRequest)a
     */
    private List<ZoneRequest> zones;
}