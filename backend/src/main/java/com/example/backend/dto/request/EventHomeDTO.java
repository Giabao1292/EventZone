package com.example.backend.dto.request;

import com.example.backend.model.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventHomeDTO {
    private int id;
    private String eventTitle;
    private String posterImage;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double lowestPrice;

    public EventHomeDTO(Event event, double lowestPrice) {
        this.id = event.getId();
        this.eventTitle = event.getEventTitle();
        this.posterImage = event.getPosterImage();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.lowestPrice = lowestPrice;
    }
}
