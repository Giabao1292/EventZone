package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventAdsResponse {
    private Integer id;
    private Integer eventId;
    private String eventTitle;
    private Integer organizerId;
    private String organizerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String bannerImageUrl;
    private String posterImage;
    private String status;
}
