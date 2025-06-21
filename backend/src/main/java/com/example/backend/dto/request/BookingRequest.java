package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class BookingRequest {
    @NotNull
    private Integer showingTimeId;

    @NotBlank
    private String paymentMethod;

    private List<SeatBookingDTO> seats;
    private List<ZoneBookingDTO> zones;

    @Data
    public static class SeatBookingDTO {
        @NotNull
        private Integer seatId;
        @NotNull
        private BigDecimal price;
    }

    @Data
    public static class ZoneBookingDTO {
        @NotNull
        private Integer zoneId;
        @NotNull
        private Integer quantity;
        @NotNull
        private BigDecimal price;
    }
}