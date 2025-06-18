package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShowingTimeDTO {
    private int id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String layoutMode;

    private AddressDTO address;
    private List<SeatDTO> seats;
    private List<ZoneDTO> zones;
}
