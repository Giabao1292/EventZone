package com.example.backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventRescheduleRequestResponseDTO {
    private Integer id;
    private Integer eventId;
    private String eventTitle;
    private Integer showingTimeId;
    private LocalDateTime oldStartTime;
    private LocalDateTime oldEndTime;
    private LocalDateTime requestedStartTime;
    private LocalDateTime requestedEndTime;
    private String reason;
    private String status;
    private String requestedByName;
    private LocalDateTime requestedAt;
    private String approvedByName;
    private LocalDateTime respondedAt;
    private String adminNote;
}
