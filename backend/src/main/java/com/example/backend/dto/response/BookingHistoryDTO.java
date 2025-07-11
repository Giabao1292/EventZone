package com.example.backend.dto.response;

import com.example.backend.model.Booking;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingHistoryDTO {
    private Long bookingId;
    private String eventTitle;
    private String venue;
    private int showingTimeId;
    private LocalDateTime showTime;
    private LocalDateTime endTime;
    private LocalDateTime bookedAt;
    private BigDecimal finalPrice;
    private String paymentMethod;
    private String paymentStatus;
    private String checkinStatus;
    private String imageUrl;
    private List<String> seatNumbers;

    public BookingHistoryDTO(Booking booking) {
        this.bookingId = booking.getId();

        // Danh sách ghế hoặc khu
        this.seatNumbers = booking.getTblBookingSeats()
                .stream()
                .map(bs -> {
                    if (bs.getSeat() != null && bs.getSeat().getSeatLabel() != null) {
                        return bs.getSeat().getSeatLabel();
                    } else if (bs.getZone() != null) {
                        return bs.getZone().getZoneName() + " x" + bs.getQuantity();
                    } else {
                        return "Unknown";
                    }
                })
                .collect(Collectors.toList());

        // ID suất chiếu
        this.showingTimeId = booking.getShowingTime() != null
                ? booking.getShowingTime().getId()
                : 0;

        // Tiêu đề sự kiện
        this.eventTitle = booking.getShowingTime() != null && booking.getShowingTime().getEvent() != null
                ? booking.getShowingTime().getEvent().getEventTitle()
                : null;

        // Địa điểm
        this.venue = booking.getShowingTime() != null && booking.getShowingTime().getAddress() != null
                ? booking.getShowingTime().getAddress().getVenueName()
                : null;

        // Thời gian chiếu
        this.showTime = booking.getShowingTime() != null
                ? booking.getShowingTime().getStartTime()
                : null;

        this.endTime = booking.getShowingTime() != null
                ? booking.getShowingTime().getEndTime()
                : null;

        // Ngày đặt
        this.bookedAt = booking.getCreatedDatetime();

        // Giá
        this.finalPrice = booking.getFinalPrice();

        // Thanh toán
        this.paymentMethod = booking.getPaymentMethod();
        this.paymentStatus = booking.getPaymentStatus();

        // Trạng thái checkin
        this.checkinStatus = booking.getCheckinStatus() != null
                ? booking.getCheckinStatus().name()
                : null;

        // Ảnh sự kiện
        this.imageUrl = booking.getShowingTime() != null &&
                booking.getShowingTime().getEvent() != null
                ? booking.getShowingTime().getEvent().getPosterImage()
                : null;
    }
}