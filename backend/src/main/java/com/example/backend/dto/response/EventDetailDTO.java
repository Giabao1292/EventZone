package com.example.backend.dto.response;

import lombok.*;


import java.util.List;


@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDetailDTO {
    private Integer id;
    private String eventTitle;
    private String description;
    private Integer categoryId;
    private String bannerText;
    private String headerImage;
    private String posterImage;
    private String ageRating;
    private String location;
    private String city;
    private String venueName;
    private Integer maxCapacity;
    private String startTime; // hoặc LocalDateTime nếu bạn muốn
    private String endTime;
    private Integer statusId;
    // Các trường khác bạn cần

    // Nếu có list ShowingTimes, thêm luôn
    private List<ShowingTimeDTO> showingTimes;
}

