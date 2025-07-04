package com.example.backend.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class ShowingTimeRequest {
    private Integer id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime saleOpenTime;
    private LocalDateTime saleCloseTime;
    private String layoutMode;

    private Integer addressId;     // ID địa chỉ của suất chiếu (nếu đã có)
    private String venueName;      // Tên địa điểm (có thể thay đổi)
    private String location;       // Địa chỉ chi tiết (phường, quận...)
    private String city;           // Tỉnh/Thành phố
}
