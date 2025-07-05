package com.example.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventSummaryAdmin {
    private Integer id;
    private String eventTitle;
    private String ageRating;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String description;
    private String organizerName;
    private String categoryName;
    private String posterImage;
    private String status;
    private String address;
}
