package com.example.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventRequest {
    private Integer organizerId;
    private String eventTitle;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer categoryId;
    private String ageRating;
    private String bannerText;
    private String headerImage;
    private String posterImage;

}
