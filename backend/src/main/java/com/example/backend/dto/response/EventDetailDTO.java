package com.example.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Data
public class EventDetailDTO {
    private int id;
    private String eventTitle;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String headerImage;

    private List<ShowingTimeDTO> showingTimes;
}
