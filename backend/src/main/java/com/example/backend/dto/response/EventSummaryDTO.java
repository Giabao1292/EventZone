package com.example.backend.dto.response;

import com.example.backend.model.Event;
import lombok.Data;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Data
public class EventSummaryDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String date;
    private String imageUrl;

    public EventSummaryDTO(Event event) {
        this.id = event.getId().longValue(); // Vì Event dùng Integer
        this.title = event.getEventTitle();  // ánh xạ đúng tên
        this.description = event.getDescription();
        this.location = "Unknown"; // Vì chưa có field location
        this.date = formatDate(event.getStartTime()); // convert từ Instant
        this.imageUrl = event.getPosterImage(); // dùng 1 trong 3 ảnh bạn có
    }

    private String formatDate(java.time.LocalDateTime localDateTime) {
        return localDateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
