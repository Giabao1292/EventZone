package com.example.backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Integer userId;
    private Integer showingTimeId;
    private String paymentMethod;
    private String voucherCode;
    private List<SeatSelection> seatSelections;
    private List<ZoneSelection> zoneSelections;

    @Data
    public static class SeatSelection {
        private Integer seatId;
    }

    @Data
    public static class ZoneSelection {
        private Integer zoneId;
        private Integer quantity;
    }
}
