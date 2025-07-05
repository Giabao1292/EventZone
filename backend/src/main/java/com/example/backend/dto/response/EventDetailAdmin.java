package com.example.backend.dto.response;

import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDetailAdmin {
    private Integer id;
    private String eventTitle;
    private String ageRating;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String description;
    private String bannerText;
    private String headerImage;
    private Instant createdAt;
    private Instant updatedAt;
    private String status;
    private String rejectionReason;

    private Integer organizerId;
    private String organizerName;
    private String organizerEmail;
    private String address;
    private String orgLogoUrl;

    private String categoryName;

    private List<ShowingTimeDTO> showingTimes;
}
