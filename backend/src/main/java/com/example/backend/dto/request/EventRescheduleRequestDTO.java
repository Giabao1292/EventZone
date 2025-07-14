package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class EventRescheduleRequestDTO {
    private Integer eventId;
    private Integer showingTimeId;
    private LocalDateTime newStartTime;
    private LocalDateTime newEndTime;
    private LocalDateTime oldStartTime;
    private LocalDateTime oldEndTime;
    private LocalDateTime requestedStartTime;
    private LocalDateTime requestedEndTime;
    private String reason;
}
