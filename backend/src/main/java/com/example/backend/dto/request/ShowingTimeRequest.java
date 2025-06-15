package com.example.backend.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class ShowingTimeRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime saleOpenTime;
    private LocalDateTime saleCloseTime;
    private String layoutMode;
}
