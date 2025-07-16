package com.example.backend.service.impl;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.AnalyticAttendeesResponse;
import com.example.backend.dto.response.AttendeeResponse;
import com.example.backend.dto.response.BookingHistoryDTO;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.*;
import com.example.backend.util.CheckIn;
import jakarta.mail.MessagingException;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.config.AnsiOutputApplicationListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import vn.payos.PayOS;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.backend.util.CheckIn.CHECKED_IN;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowingTimeRepository showingTimeRepository;
    private final SeatRepository seatRepository;
    private final ZoneRepository zoneRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ImageService imageService;
    private final QrCodeService qrCodeService;
    private final SearchCriteriaRepository searchCriteriaRepository;
    private final UserVoucherRepository userVoucherRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final MailService mailService;
    @Override
    @Transactional
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

        // Process seat bookings
        if (request.getSeats() != null) {
            for (BookingRequest.SeatBookingDTO dto : request.getSeats()) {
                Seat seat = seatRepository.findByIdForUpdate(dto.getSeatId())
                        .orElseThrow(() -> new RuntimeException("Seat not found"));

                boolean seatTaken = bookingSeatRepository.existsBySeatIdAndStatusIn(
                        seat.getId(), List.of("HOLD", "BOOKED"));
                if (seatTaken) {
                    throw new RuntimeException("Seat " + seat.getSeatLabel() + " is already held or booked.");
                }

                BookingSeat bs = new BookingSeat();
                bs.setSeat(seat);
                bs.setBooking(booking);
                bs.setQuantity(1);
                bs.setPrice(dto.getPrice());
                bs.setStatus("HOLD");
                bookingSeats.add(bs);
                total = total.add(dto.getPrice());
            }
        }

        // Process zone bookings
        if (request.getZones() != null) {
            for (BookingRequest.ZoneBookingDTO dto : request.getZones()) {
                Zone zone = zoneRepository.findByIdForUpdate(dto.getZoneId())
                        .orElseThrow(() -> new RuntimeException("Zone not found"));

                if (zone.getCapacity() < dto.getQuantity()) {
                    throw new RuntimeException("Not enough tickets in zone: " + zone.getZoneName());
                }

                zone.setCapacity(zone.getCapacity() - dto.getQuantity());
                zoneRepository.save(zone);

                BookingSeat bs = new BookingSeat();
                bs.setZone(zone);
                bs.setBooking(booking);
                bs.setQuantity(dto.getQuantity());
                bs.setPrice(dto.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
                bs.setStatus("HOLD");
                bookingSeats.add(bs);
                total = total.add(bs.getPrice());
            }
        }

        booking.setOriginalPrice(total);

        // Handle voucher if provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal finalPrice = total;

        if (request.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Voucher not found"));

            if (voucher.getStatus() != 1 || voucher.getValidUntil().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Voucher is inactive or expired");
            }

            if (user.getScore() < voucher.getRequiredPoints()) {
                throw new IllegalArgumentException("Not enough points to redeem this voucher");
            }

            UserVoucher userVoucher = userVoucherRepository
                    .findByUserIdAndVoucherIdAndIsUsedFalse(user.getId(), request.getVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("You must redeem this voucher before using it"));

            discountAmount = voucher.getDiscountAmount();
            finalPrice = total.subtract(discountAmount).max(BigDecimal.ZERO);
            booking.setVoucher(voucher);
        }

        booking.setDiscountAmount(discountAmount);
        booking.setFinalPrice(finalPrice);
        booking.setTblBookingSeats(bookingSeats);

        return bookingRepository.save(booking);
    }


    @Override
    @Transactional
    public Booking confirmBooking(Integer bookingId, String paymentMethod) throws IOException, MessagingException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));
        User user = booking.getUser();
        if (!"PENDING".equals(booking.getPaymentStatus())) {
            throw new RuntimeException("Booking không hợp lệ để xác nhận");
        }
        if (booking.getVoucher() != null) {
            Voucher voucher = booking.getVoucher();

            if (user.getScore() < voucher.getRequiredPoints()) {
                throw new IllegalArgumentException("Không đủ điểm để sử dụng voucher này");
            }

            user.setScore(user.getScore() - voucher.getRequiredPoints());
            userRepository.save(user);

            UserVoucher userVoucher = userVoucherRepository
                    .findByUserIdAndVoucherIdAndIsUsedFalse(user.getId(), voucher.getId())
                    .orElseThrow(() -> new RuntimeException("Voucher chưa được redeem hoặc đã được sử dụng"));
            userVoucher.setUsed(true);
            userVoucherRepository.save(userVoucher);
        }

        // Tạo mã QR và cập nhật thông tin thanh toán
        String token = UUID.randomUUID().toString();
        String publicId = imageService.uploadQRCodeImage(qrCodeService.generateQRCodeImage(token));

        booking.setQrToken("TK" + token);
        booking.setQrPublicId(publicId);
        booking.setPaymentMethod(paymentMethod);
        booking.setPaymentStatus("CONFIRMED");
        booking.setCheckinStatus(CheckIn.NOT_CHECKED_IN);
        booking.setPaidAt(LocalDateTime.now());

        // Cập nhật trạng thái seat
        for (BookingSeat bs : booking.getTblBookingSeats()) {
            bs.setStatus("BOOKED");
        }
        bookingSeatRepository.saveAll(booking.getTblBookingSeats());

        // Cộng điểm thưởng
        user.setScore(user.getScore() + 20);
        userRepository.save(user);
        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking saved successfully: ID {}", savedBooking.getId());

        try {
            log.info("Sending notification for booking: {}", savedBooking.getId());
            notificationService.notifyBookingConfirmation(user, savedBooking);
            log.info("Triggering email send for user: {}, booking: {}", user.getEmail(), savedBooking.getId());
            mailService.sendBookingConfirmationEmail(user, savedBooking);
        } catch (Exception e) {
            log.error("Failed to send notification or email for booking: {}, user: {}. Error: {}",
                    savedBooking.getId(), user.getEmail(), e.getMessage(), e);
        }
        return savedBooking;
    }

    @Transactional
    @Scheduled(fixedRate = 60000)
    public void removeExpiredHolds() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(5);

        List<Booking> expiredBookings = bookingRepository
                .findAllByPaymentStatusAndCreatedDatetimeBefore("PENDING", threshold);

        for (Booking booking : expiredBookings) {
            // Cập nhật lại capacity cho các zone nếu cần
            for (BookingSeat bs : booking.getTblBookingSeats()) {
                if (bs.getZone() != null) {
                    Zone zone = bs.getZone();
                    zone.setCapacity(zone.getCapacity() + bs.getQuantity());
                    zoneRepository.save(zone);
                }
            }
            bookingRepository.delete(booking);
        }
    }
    private Page<Booking> findAll(Pageable pageable,int eventId, LocalDateTime startTime) {
        Page<Long> ids = bookingRepository.findBookingIdByEventId(eventId, startTime, pageable);
        List<Booking> bookings = bookingRepository.findBookingById(ids.getContent());
        return new PageImpl<>(bookings, pageable, ids.getTotalElements());
    }

    @Override
    public PageResponse<AttendeeResponse> searchAttendees(Pageable pageable, int eventId, LocalDateTime startTime, String[] search) {
        Page<Booking> bookingPage = search != null && search.length != 0
                ? searchCriteriaRepository.searchAttendees(pageable, eventId, startTime, search)
                : findAll(pageable, eventId, startTime);

        List<AttendeeResponse> attendeeResponseList = bookingPage.getContent().stream().map(booking -> {
            String seatLabels = booking.getTblBookingSeats().stream()
                    .filter(bs -> bs.getSeat() != null)
                    .map(bs -> bs.getSeat().getSeatLabel())
                    .distinct()
                    .collect(Collectors.joining(", "));

            String zoneNames = booking.getTblBookingSeats().stream()
                    .filter(bs -> bs.getZone() != null)
                    .map(bs -> bs.getZone().getZoneName())
                    .distinct()
                    .collect(Collectors.joining(", "));

            return AttendeeResponse.builder()
                    .id(booking.getId().intValue())
                    .phone(booking.getUser().getPhone())
                    .email(booking.getUser().getEmail())
                    .fullName(booking.getUser().getFullName())
                    .checkInStatus(booking.getCheckinStatus())
                    .checkInTime(booking.getCheckinTime())
                    .numberOfSeats(booking.getTblBookingSeats().size())
                    .paidAt(booking.getPaidAt())
                    .qrToken(booking.getQrToken())
                    .seatLabels(seatLabels)
                    .zoneNames(zoneNames)
                    .build();
        }).toList();

        return PageResponse.<AttendeeResponse>builder()
                .totalElements((int) bookingPage.getTotalElements())
                .number(bookingPage.getNumber())
                .size(bookingPage.getSize())
                .totalPages(bookingPage.getTotalPages())
                .content(attendeeResponseList)
                .build();
    }



    @Override
    public void checkIn(Integer id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Attendee not found"));
        booking.setCheckinStatus(CHECKED_IN);
        booking.setCheckinTime(Instant.now());
        bookingRepository.save(booking);
    }

    @Override
    public AnalyticAttendeesResponse getAnalytics(int eventId, LocalDateTime startTime) {
        List<Booking> bookings = bookingRepository.findByShowingTimeStartTimeAndShowingTimeEventId(startTime, eventId);
        int numberOfCheckIns = (int)bookings.stream().filter(booking->booking.getCheckinStatus().equals(CHECKED_IN)).count();
        double averageAttendees = numberOfCheckIns * 100.0 / bookings.size();
        return AnalyticAttendeesResponse.builder()
                .numberOfCheckIns(numberOfCheckIns)
                .numberOfSeats(bookings.stream().mapToInt(booking -> booking.getTblBookingSeats().size()).sum())
                .sale(bookings.stream().mapToLong(booking-> booking.getFinalPrice().longValue()).sum())
                .averageAttendees(averageAttendees)
                .numberOfAttendees(bookings.size())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingHistoryDTO> getBookingHistory(String username) {
        List<Booking> bookings = bookingRepository.findByUserEmail(username);

        return bookings.stream()
                .map(BookingHistoryDTO::new)
                .toList();
    }


    @Override
    public List<Booking> findByUserIdAndPaymentStatus(Integer userId, String paymentStatus) {
        return bookingRepository.findByUserIdAndPaymentStatus(userId, paymentStatus);
    }


    @Override
    public List<Integer> getConfirmedShowingTimeIdsByUserId(Integer userId) {
        return bookingRepository.findConfirmedShowingTimeIdsByUserId(userId, "CONFIRMED");

    }

}