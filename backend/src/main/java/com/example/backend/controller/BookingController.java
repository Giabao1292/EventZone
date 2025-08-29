package com.example.backend.controller;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.BookingHistoryDTO;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.Booking;
import com.example.backend.model.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.BookingService;
import com.example.backend.service.JwtService;
import com.example.backend.service.VNPayService;
import com.example.backend.util.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final JwtService jwtService;
    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final VNPayService vnpayService;
    private final PayOS payOS;

    @PostMapping("/hold")
    public ResponseData<Booking> hold(@RequestBody BookingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Booking booking = bookingService.holdBooking(request, user);
        return new ResponseData<>(HttpStatus.OK.value(), "Giữ chỗ thành công", booking);
    }

    @PostMapping("/pay")
    public ResponseData<?> pay(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer bookingId = (Integer) body.get("bookingId");
        String paymentMethod = (String) body.get("paymentMethod");
        Integer amount = (Integer) body.get("amount");
        String description = (String) body.get("description");

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        try {
            String checkoutUrl;
            if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
                PaymentData paymentData = PaymentData.builder()
                        .orderCode(Long.valueOf(bookingId))
                        .amount(amount)
                        .description(description)
                        .returnUrl("http://localhost:5173/payment-result?orderId=" + bookingId)
                        .cancelUrl("http://localhost:5173/payment-cancel")
                        .build();
                CheckoutResponseData payosData = payOS.createPaymentLink(paymentData);
                checkoutUrl = payosData.getCheckoutUrl();
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                checkoutUrl = vnpayService.createPaymentUrl(booking, request);
            } else {
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
            }

            return new ResponseData<>(200, "Tạo link thành công", Map.of("checkoutUrl", checkoutUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Lỗi tạo link: " + e.getMessage(), null);
        }
    }

    @GetMapping("/verify")
    public ResponseData<?> verify(@RequestParam Integer orderId,
                                  @RequestParam String paymentMethod,
                                  @RequestParam(required = false) String vnp_ResponseCode,
                                  HttpServletRequest request) {
        try {
            if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
                PaymentLinkData payment = payOS.getPaymentLinkInformation(Long.valueOf(orderId));
                if ("PAID".equalsIgnoreCase(payment.getStatus())) {
                    bookingService.confirmBooking(orderId, paymentMethod);
                    return new ResponseData<>(200, "Thanh toán thành công (PayOS)", null);
                } else {
                    return new ResponseData<>(400, "Thanh toán chưa hoàn tất (PayOS)", null);
                }
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                if ("00".equals(vnp_ResponseCode)) {
                    bookingService.confirmBooking(orderId, paymentMethod);
                    return new ResponseData<>(200, "Thanh toán thành công (VNPAY)", null);
                } else {
                    return new ResponseData<>(400, "Thanh toán thất bại (VNPAY)", null);
                }
            } else {
                return new ResponseData<>(400, "Phương thức thanh toán không hợp lệ", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Lỗi xác minh thanh toán: " + e.getMessage(), null);
        }
    }

    @PreAuthorize("hasAnyRole({'ORGANIZER', 'ADMIN'})")
    @PatchMapping("/{bookingId}/check-in")
    public ResponseData<?> checkInAttendee(@PathVariable Integer bookingId) {
        bookingService.checkIn(bookingId);
        return new ResponseData<>(HttpStatus.OK.value(), "Check-in thành công");
    }

    @GetMapping("/history")
    public ResponseData<List<BookingHistoryDTO>> getBookingHistory(HttpServletRequest request) {
        try {
            String username = jwtService.extractUsername(
                    request.getHeader("Authorization").substring(7),
                    TokenType.ACCESS_TOKEN
            );

            List<BookingHistoryDTO> history = bookingService.getBookingHistory(username);
            return new ResponseData<>(HttpStatus.OK.value(), "Lấy lịch sử đặt vé thành công", history);
        } catch (Exception e) {
            return new ResponseData<>(500, "Lỗi: " + e.getMessage(), null);
        }
    }

    @GetMapping("/confirmed-showing-time-ids")
    public ResponseEntity<ResponseData<List<Integer>>> getConfirmedShowingTimeIdsByUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Integer> showingTimeIds = bookingService.getConfirmedShowingTimeIdsByUserId(user.getId());
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách suất chiếu đã xác nhận thành công", showingTimeIds));
    }
}
