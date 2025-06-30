package com.example.backend.service.impl;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.BookingService;
import com.example.backend.service.ImageService;
import com.example.backend.service.QrCodeService;
import vn.payos.PayOS;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowingTimeRepository showingTimeRepository;
    private final SeatRepository seatRepository;
    private final ZoneRepository zoneRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ImageService imageService;
    private final QrCodeService qrCodeService;

    @Override
    public Booking holdBooking(BookingRequest request, User user) {
        ShowingTime showingTime = showingTimeRepository.findById(request.getShowingTimeId())
                .orElseThrow(() -> new RuntimeException("Showing time not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowingTime(showingTime);
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
    @Override
    @Transactional
    public Booking confirmBooking(Integer bookingId, String paymentMethod) throws IOException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        if (!"PENDING".equals(booking.getPaymentStatus())) {
            throw new RuntimeException("Booking không hợp lệ để xác nhận");
        }
        String token = UUID.randomUUID().toString();
        String publicId = imageService.uploadQRCodeImage(qrCodeService.generateQRCodeImage(token));
        booking.setQrToken(token);
        booking.setQrPublicId(publicId);
        booking.setPaymentMethod(paymentMethod);
        booking.setPaymentStatus("CONFIRMED");
        booking.setPaidAt(LocalDateTime.now());
        booking.getTblBookingSeats().forEach(bs -> bs.setStatus("BOOKED"));
        bookingSeatRepository.saveAll(booking.getTblBookingSeats());

        return bookingRepository.save(booking);
    }


    @Scheduled(fixedRate = 60000)
    public void removeExpiredHolds() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(3);
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