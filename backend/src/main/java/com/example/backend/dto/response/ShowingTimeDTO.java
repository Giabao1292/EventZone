package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShowingTimeDTO {
    private int id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String layoutMode;

    private AddressDTO address;
    private List<SeatDTO> seats;
    private List<ZoneDTO> zones;

    private LocalDateTime saleOpenTime;
    private LocalDateTime saleCloseTime;

    private String status;
    private Boolean hasDesignedLayout;

}
