package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShowingTimeAdmin {
    private Integer id;
    private Integer event_id;
    private Integer organizerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime saleOpenTime;
    private LocalDateTime saleCloseTime;
}
