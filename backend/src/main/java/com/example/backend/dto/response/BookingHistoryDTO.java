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
    private LocalDateTime showTime;
    private LocalDateTime bookedAt;
    private BigDecimal finalPrice;
    private String paymentMethod;
    private String paymentStatus;
    private String checkinStatus;
    private String imageUrl;

    private List<String> seatNumbers;

    public BookingHistoryDTO(Booking booking) {
        this.bookingId = booking.getId();

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


        // Lấy tiêu đề sự kiện
        this.eventTitle = booking.getShowingTime() != null && booking.getShowingTime().getEvent() != null
                ? booking.getShowingTime().getEvent().getEventTitle()
                : null;

        // Lấy địa điểm tổ chức
        this.venue = booking.getShowingTime() != null && booking.getShowingTime().getAddress() != null
                ? booking.getShowingTime().getAddress().getVenueName()
                : null;

        // Lấy thời gian chiếu
        this.showTime = booking.getShowingTime() != null
                ? booking.getShowingTime().getStartTime()
                : null;

        this.bookedAt = booking.getCreatedDatetime();
        this.finalPrice = booking.getFinalPrice();
        this.paymentMethod = booking.getPaymentMethod();
        this.paymentStatus = booking.getPaymentStatus();

        // Trạng thái checkin
        this.checkinStatus = booking.getCheckinStatus() != null
                ? booking.getCheckinStatus().name()
                : null;

        // ✅ Lấy ảnh sự kiện từ posterImage của Event
        this.imageUrl = booking.getShowingTime() != null &&
                booking.getShowingTime().getEvent() != null
                ? booking.getShowingTime().getEvent().getPosterImage()
                : null;
    }
}
