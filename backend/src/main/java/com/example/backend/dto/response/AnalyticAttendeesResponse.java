package com.example.backend.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticAttendeesResponse {
    private int numberOfAttendees;
    private int numberOfCheckIns;
    private int numberOfSeats;
    private long sale;
    private double averageAttendees;
}
