package com.example.backend.dto.response;

import com.example.backend.model.Address;
import com.example.backend.model.Event;
import com.example.backend.model.ShowingTime;
import lombok.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSummaryDTO {
    private Integer id;
    private String title;
    private String description;
    private String location;
    private String date;
    private LocalDateTime startTime;
    private String imageUrl;
    private String status;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EventSummaryDTO(Event event) {
        this.id = event.getId();
        this.title = event.getEventTitle();
        this.description = event.getDescription();

        // Lấy ShowingTime đầu tiên để lấy Address
        String locationStr = "Unknown";
        if (event.getTblShowingTimes() != null && !event.getTblShowingTimes().isEmpty()) {
            ShowingTime st = event.getTblShowingTimes().iterator().next();
            Address address = st.getAddress();
            if (address != null) {
                locationStr = address.getVenueName() + ", " + address.getLocation() + ", " + address.getCity();
            }
        }
        this.location = locationStr;

        this.startTime = event.getStartTime();
        this.imageUrl = event.getPosterImage();
        this.status = event.getStatus() != null ? event.getStatus().getStatusName() : null;
        this.category = event.getCategory() != null ? event.getCategory().getCategoryName() : null;
        this.createdAt = event.getCreatedAt() != null ? event.getCreatedAt().atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDateTime() : null;
        this.updatedAt = event.getUpdatedAt() != null ? event.getUpdatedAt().atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDateTime() : null;
        
        // Debug log
        System.out.println("Event ID: " + event.getId() + " - CreatedAt: " + this.createdAt + " - UpdatedAt: " + this.updatedAt + " - StartTime: " + event.getStartTime());
    }

    private String formatDate(LocalDateTime localDateTime) {
        return localDateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
