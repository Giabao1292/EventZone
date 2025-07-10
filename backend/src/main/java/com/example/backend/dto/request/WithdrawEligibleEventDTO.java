package com.example.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class WithdrawEligibleEventDTO {
    private Integer eventId;
    private String eventTitle;
    private Integer showingTimeId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal availableRevenue;

}