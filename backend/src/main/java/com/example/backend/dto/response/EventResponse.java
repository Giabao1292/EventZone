package com.example.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EventResponse {
    private int id;
    private String posterImage;
    private String eventTitle;
    private LocalDateTime startTime;
}
