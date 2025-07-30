package com.example.backend.service.impl;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.*;
import com.example.backend.util.CheckIn;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
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
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thời gian chiếu"));

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
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy ghế"));

                boolean seatTaken = bookingSeatRepository.existsBySeatIdAndStatusIn(
                        seat.getId(), List.of("HOLD", "BOOKED"));
                if (seatTaken) {
                    throw new RuntimeException("Ghế " + seat.getSeatLabel() + " đã được giữ hoặc đặt.");
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
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy khu vực"));

                if (zone.getCapacity() < dto.getQuantity()) {
                    throw new RuntimeException("Không đủ vé trong khu vực: " + zone.getZoneName());
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
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy voucher"));

            if (voucher.getStatus() != 1 || voucher.getValidUntil().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Voucher không hoạt động hoặc đã hết hạn");
            }


            UserVoucher userVoucher = userVoucherRepository
                    .findByUserIdAndVoucherIdAndIsUsedFalse(user.getId(), request.getVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("Bạn phải đổi voucher này trước khi sử dụng"));

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

            // Chỉ đánh dấu voucher đã sử dụng, không trừ điểm nữa
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
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(10);

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

    private Page<Booking> findAll(Pageable pageable, int eventId, LocalDateTime startTime) {
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
            // Ghế chỉ định cụ thể
            List<BookingSeat> seatBookings = booking.getTblBookingSeats().stream()
                    .filter(bs -> bs.getSeat() != null)
                    .toList();
            String seatLabels = seatBookings.stream()
                    .map(bs -> bs.getSeat().getSeatLabel())
                    .distinct()
                    .collect(Collectors.joining(", "));
            int seatLabelCount = seatBookings.stream()
                    .mapToInt(BookingSeat::getQuantity)
                    .sum();

            // Ghế đặt theo zone (chưa chỉ định ghế cụ thể)
            Map<String, Integer> zoneCountMap = booking.getTblBookingSeats().stream()
                    .filter(bs -> bs.getZone() != null && bs.getSeat() == null)
                    .collect(Collectors.groupingBy(
                            bs -> bs.getZone().getZoneName(),
                            Collectors.summingInt(BookingSeat::getQuantity)
                    ));

            String zoneNames = zoneCountMap.entrySet().stream()
                    .map(e -> e.getKey() + " x" + e.getValue())
                    .collect(Collectors.joining(", "));

            String zoneSeatCounts = zoneCountMap.values().stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));

            int zoneCount = zoneCountMap.values().stream().mapToInt(i -> i).sum();

            // Tổng số ghế = ghế chỉ định cụ thể + ghế theo zone
            int totalSeats = seatLabelCount + zoneCount;

            return AttendeeResponse.builder()
                    .id(booking.getId().intValue())
                    .phone(booking.getUser().getPhone())
                    .email(booking.getUser().getEmail())
                    .fullName(booking.getUser().getFullName())
                    .checkInStatus(booking.getCheckinStatus())
                    .checkInTime(booking.getCheckinTime())
                    .numberOfSeats(totalSeats)
                    .paidAt(booking.getPaidAt())
                    .qrToken(booking.getQrToken())
                    .seatLabels(seatLabels)
                    .zoneNames(zoneNames)
                    .zoneSeatCounts(zoneSeatCounts)
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
        
        // Kiểm tra thời gian sự kiện
        LocalDateTime eventStartTime = booking.getShowingTime().getStartTime();
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime checkInDeadline = eventStartTime.minusHours(12); // Chỉ cho phép check-in trước 12 tiếng
        
        // Kiểm tra xem thời gian hiện tại có trong khoảng cho phép check-in không
        // Chỉ cho phép check-in từ thời điểm hiện tại đến 12 tiếng trước sự kiện
        if (currentTime.isAfter(eventStartTime)) {
            throw new RuntimeException("Không thể check-in. Sự kiện đã kết thúc.");
        }
        
        if (currentTime.isBefore(checkInDeadline)) {
            throw new RuntimeException("Không thể check-in. Chỉ có thể check-in trong khoảng 12 tiếng trước sự kiện.");
        }
        
        // Kiểm tra trạng thái check-in
        if (booking.getCheckinStatus() == CHECKED_IN) {
            throw new RuntimeException("Người tham dự đã được check-in trước đó.");
        }
        booking.setCheckinStatus(CHECKED_IN);
        booking.setCheckinTime(Instant.now());
        bookingRepository.save(booking);
    }

//    @Override
//    public AnalyticAttendeesResponse getAnalytics(int eventId, LocalDateTime startTime) {
//        List<Booking> bookings = bookingRepository.findByShowingTimeStartTimeAndShowingTimeEventId(startTime, eventId);
//        int numberOfCheckIns = (int)bookings.stream().filter(booking->booking.getCheckinStatus().equals(CHECKED_IN)).count();
//        double averageAttendees = numberOfCheckIns * 100.0 / bookings.size();
//        return AnalyticAttendeesResponse.builder()
//                .numberOfCheckIns(numberOfCheckIns)
//                .numberOfSeats(bookings.stream().mapToInt(booking -> booking.getTblBookingSeats().size()).sum())
//                .sale(bookings.stream().mapToLong(booking-> booking.getFinalPrice().longValue()).sum())
//                .averageAttendees(averageAttendees)
//                .numberOfAttendees(bookings.size())
//                .build();
//    }

    @Override
    public AnalyticAttendeesResponse getAnalytics(int eventId, LocalDateTime startTime) {
        // Lấy danh sách booking đã CONFIRMED
        List<Booking> bookings = bookingRepository.findByShowingTimeStartTimeAndShowingTimeEventIdAndPaymentStatus(
                startTime, eventId, "CONFIRMED"
        );

        // Tổng số ghế đã đặt (tức là tổng quantity các BookingSeat)
        int totalSeats = bookings.stream()
                .flatMap(booking -> booking.getTblBookingSeats().stream())
                .mapToInt(BookingSeat::getQuantity)
                .sum();

        // Tổng số ghế đã check-in (của booking đã check-in)
        int checkedInSeats = bookings.stream()
                .filter(booking -> booking.getCheckinStatus() == CHECKED_IN)
                .flatMap(booking -> booking.getTblBookingSeats().stream())
                .mapToInt(BookingSeat::getQuantity)
                .sum();

        // Tỷ lệ tham dự
        double averageAttendees = totalSeats > 0 ? checkedInSeats * 100.0 / totalSeats : 0;

        return AnalyticAttendeesResponse.builder()
                .numberOfCheckIns(checkedInSeats)
                .numberOfSeats(totalSeats)
                .sale(bookings.stream().mapToLong(booking -> booking.getFinalPrice().longValue()).sum())
                .averageAttendees(averageAttendees)
                .numberOfAttendees(totalSeats)
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

    private Page<Booking> findAll(String orgName, Pageable pageable) {
        Page<Long> ids = bookingRepository.findAllBookingId(orgName, pageable);
        List<Booking> bookings = bookingRepository.findAllBookingById(ids.getContent());
        return new PageImpl<>(bookings, pageable, ids.getTotalElements());
    }

    @Override
    public PageResponse<BookingResponseDTO> searchBooking(String orgName, Pageable pageable, String[] search) {
        String[] newSearch = search != null ? Arrays.copyOf(search, search.length + 1) : new String[1];
        if(orgName != null && !orgName.isEmpty()){
            newSearch[newSearch.length - 1] = "orgName:" + orgName;
        }
        Page<Booking> page = search != null && search.length != 0 ? searchCriteriaRepository.searchBooking(pageable, newSearch) : findAll(orgName, pageable);
        List<BookingResponseDTO> bookingResponseDTOS = page.getContent().stream().map(booking ->
                BookingResponseDTO.builder()
                        .bookingId(booking.getId())
                        .fullName(booking.getUser().getFullName())
                        .email(booking.getUser().getEmail())
                        .eventTitle(booking.getShowingTime().getEvent().getEventTitle())
                        .finalPrice(booking.getFinalPrice())
                        .paymentMethod(booking.getPaymentMethod())
                        .paymentStatus(booking.getPaymentStatus())
                        .showingTime(booking.getShowingTime().getStartTime())
                        .numberOfSeats(booking.getTblBookingSeats().size())
                        .paidAt(booking.getPaidAt())
                        .build()).toList();
        return PageResponse.<BookingResponseDTO>builder()
                .content(bookingResponseDTOS)
                .totalPages(page.getTotalPages())
                .number(page.getNumber())
                .size(page.getSize())
                .totalElements((int) page.getTotalElements())
                .build();
    }
}