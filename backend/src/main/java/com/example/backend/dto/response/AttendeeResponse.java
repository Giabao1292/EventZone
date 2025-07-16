package com.example.backend.dto.response;

import com.example.backend.util.CheckIn;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendeeResponse {
    private int id;
    private String fullName;
    private String email;
    private String phone;
    private String qrToken;
    private LocalDateTime paidAt;
    private int numberOfSeats;
    private Instant checkInTime;
    private CheckIn checkInStatus;

    private String seatLabels;
    private String zoneNames;
    private String zoneSeatCounts;
}
