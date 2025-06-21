package com.example.backend.service.impl;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.BookingService;
import vn.payos.PayOS;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowingTimeRepository showingTimeRepository;
    private final SeatRepository seatRepository;
    private final ZoneRepository zoneRepository;
    private final PayOS payOS = new PayOS(
            "CLIENT_ID",
            "API_KEY",
            "https://yourdomain.com/api/payos/callback"
    );

    @Override
    public Booking holdBooking(BookingRequest request, User user) {
        ShowingTime showingTime = showingTimeRepository.findById(request.getShowingTimeId())
                .orElseThrow(() -> new RuntimeException("Showing time not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowingTime(showingTime);
        booking.setPaymentMethod("PAYOS");
        booking.setPaymentStatus("PENDING");
        booking.setCreatedDatetime(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        Set<BookingSeat> bookingSeats = new LinkedHashSet<>();

        if (request.getSeats() != null) {
            for (BookingRequest.SeatBookingDTO dto : request.getSeats()) {
                Seat seat = seatRepository.findById(dto.getSeatId())
                        .orElseThrow(() -> new RuntimeException("Seat not found"));

                BookingSeat bs = new BookingSeat();
                bs.setSeat(seat);
                bs.setBooking(booking);
                bs.setQuantity(1);
                bs.setPrice(dto.getPrice());
                bs.setStatus("HOLD");

                total = total.add(dto.getPrice());
                bookingSeats.add(bs);
            }
        }

        if (request.getZones() != null) {
            for (BookingRequest.ZoneBookingDTO dto : request.getZones()) {
                Zone zone = zoneRepository.findById(dto.getZoneId())
                        .orElseThrow(() -> new RuntimeException("Zone not found"));

                if (zone.getCapacity() < dto.getQuantity()) {
                    throw new RuntimeException("Not enough tickets in zone: " + zone.getZoneName());
                }

                // ✅ Trừ luôn số lượng vé zone
                zone.setCapacity(zone.getCapacity() - dto.getQuantity());
                zoneRepository.save(zone);

                BookingSeat bs = new BookingSeat();
                bs.setZone(zone);
                bs.setBooking(booking);
                bs.setQuantity(dto.getQuantity());
                bs.setPrice(dto.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
                bs.setStatus("HOLD");

                total = total.add(bs.getPrice());
                bookingSeats.add(bs);
            }
        }

        booking.setOriginalPrice(total);
        booking.setFinalPrice(total);
        booking.setTblBookingSeats(bookingSeats);

        return bookingRepository.save(booking);
    }


    /**
     * 2. Tạo link thanh toán PayOS
     */
    @Override
    public void confirmBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getPaymentStatus().equals("HOLD")) {
            throw new RuntimeException("Booking already confirmed or expired");
        }

        booking.setPaymentStatus("CONFIRMED");
        booking.setPaidAt(Instant.now());

        for (BookingSeat bs : booking.getTblBookingSeats()) {
            bs.setStatus("CONFIRMED");
        }

        bookingRepository.save(booking);
    }
    @Scheduled(fixedRate = 60000)
    public void removeExpiredHolds() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(1);
        List<Booking> expired = bookingRepository.findAllByPaymentStatusAndCreatedDatetimeBefore("HOLD", threshold);

        for (Booking booking : expired) {
            for (BookingSeat bs : booking.getTblBookingSeats()) {
                if (bs.getZone() != null) {
                    Zone zone = bs.getZone();
                    zone.setCapacity(zone.getCapacity() + bs.getQuantity());
                    zoneRepository.save(zone);
                }
            }
        }

        bookingRepository.deleteAll(expired);
    }
}