package com.example.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventRequest {
    private Integer organizerId;      // ID của tổ chức tạo event
    private String eventTitle;        // Tiêu đề sự kiện
    private String description;       // Mô tả
    private LocalDateTime startTime;  // Thời gian bắt đầu
    private LocalDateTime endTime;    // Thời gian kết thúc
    private Integer categoryId;       // Loại sự kiện (ID)
    private String ageRating;         // Độ tuổi giới hạn
    private String bannerText;        // Banner text
    private String headerImage;       // Ảnh header
    private String posterImage;
    private Integer statusId;


    // ===== Thông tin địa điểm chính (nếu event chỉ có 1 địa chỉ cho tất cả showingTime) =====
    private String venueName;         // Tên địa điểm
    private String location;          // Địa chỉ chi tiết (phường/xã/quận/huyện)
    private String city;              // Tỉnh/Thành phố

    // ===== Nếu muốn update nhiều suất chiếu và mỗi suất chiếu có thể có address khác nhau =====
    private List<ShowingTimeRequest> showingTimes;
}
