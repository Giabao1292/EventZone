package com.example.backend.dto.request;

import lombok.Data;

import java.util.List;
@Data
public class CreateMultipleShowingTimeRequest {
    private String venueName;
    private String location;
    private String city;
    private Integer eventId;
    private List<ShowingTimeRequest> showingTimes;
}
