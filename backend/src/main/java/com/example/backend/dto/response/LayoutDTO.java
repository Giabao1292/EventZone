package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LayoutDTO {
    private String layoutMode;
    private List<SeatDTO> seats;
    private List<ZoneDTO> zones;

    private String eventTitle;
    private LocalDateTime startTime;
    private String location;

}
