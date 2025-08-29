package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LayoutGenerateResponse {
    private String content;
    private List<SeatResponse> seats;
    private List<SeatTypeResponse> seatTypes;
    private List<ZoneResponse> zones;
}
