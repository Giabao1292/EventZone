package com.example.backend.controller;

import com.example.backend.dto.request.EventAdsRequest;
import com.example.backend.dto.response.EventAdsResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.EventAds;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EventAdsService;
import com.example.backend.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/event-ads")
@RequiredArgsConstructor
public class EventAdsController {

    private final EventAdsService eventAdsService;
    private final UserRepository userRepository;
    private final VNPayService vnpayService;
    private final PayOS payOS;

    @PostMapping("/create-and-pay")
    public ResponseData<?> createAndPayAds(@RequestBody @Valid EventAdsRequest request, HttpServletRequest httpRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            EventAds saved = eventAdsService.holdAds(request, user);
            Integer adsId = saved.getId();
            String checkoutUrl;
            String paymentMethod = request.getPaymentMethod();
             Integer amount = request.getTotalPrice().intValue();
            String description = "Quảng cáo sự kiện #" + request.getEventId();

            if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
                PaymentData paymentData = PaymentData.builder()
                        .orderCode(adsId.longValue())
                        .amount(amount)
                        .description(description)
                        .returnUrl("http://localhost:5173/organizer/payment-ads-result?adsId=" + adsId)
                        .cancelUrl("http://localhost:5173/ads-payment-cancel")
                        .build();
                CheckoutResponseData payosData = payOS.createPaymentLink(paymentData);
                checkoutUrl = payosData.getCheckoutUrl();
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                checkoutUrl = vnpayService.createAdsPaymentUrl(saved, httpRequest);
            } else {
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
            }

            // 3. Trả về link thanh toán
            return new ResponseData<>(200, "Tạo quảng cáo và link thanh toán thành công", Map.of(
                    "adsId", adsId,
                    "checkoutUrl", checkoutUrl
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Lỗi: " + e.getMessage(), null);
        }
    }

    @GetMapping("/verify")
    public ResponseData<?> verifyAdsPayment(
            @RequestParam("adsId") Integer adsId,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam(value = "vnp_ResponseCode", required = false) String responseCode,
            @RequestParam(value = "vnp_TransactionNo", required = false) String transactionNo
    ) {
        try {
            if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
                PaymentLinkData payment = payOS.getPaymentLinkInformation(adsId.longValue());

                if ("PAID".equalsIgnoreCase(payment.getStatus())) {
                    eventAdsService.confirmAdsPayment(adsId, paymentMethod, null);
                    return new ResponseData<>(200, "Thanh toán thành công (PayOS)", null);
                } else {
                    return new ResponseData<>(400, "Thanh toán chưa hoàn tất (PayOS)", null);
                }
            }

            if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                if ("00".equals(responseCode)) {
                    eventAdsService.confirmAdsPayment(adsId, paymentMethod, transactionNo);
                    return new ResponseData<>(200, "Thanh toán thành công (VNPAY)", null);
                } else {
                    return new ResponseData<>(400, "Thanh toán thất bại (VNPAY)", null);
                }
            }

            return new ResponseData<>(400, "Phương thức thanh toán không hợp lệ", null);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Lỗi xác minh: " + e.getMessage(), null);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<?> getAdsByStatus(@RequestParam(required = false) String status) {
        try {
            List<EventAds> adsList;
            if (status == null || status.equalsIgnoreCase("ALL")) {
                adsList = eventAdsService.getAll();
            } else {
                adsList = eventAdsService.getByStatus(EventAds.AdsStatus.valueOf(status.toUpperCase()));
            }

            List<EventAdsResponse> responseList = adsList.stream()
                    .map(eventAdsService::toResponse)
                    .collect(Collectors.toList());

            return new ResponseData<>(200, "Lấy danh sách quảng cáo thành công", responseList);

        } catch (IllegalArgumentException e) {
            return new ResponseData<>(400, "Trạng thái không hợp lệ: " + status, null);
        } catch (Exception e) {
            return new ResponseData<>(500, "Lỗi khi lấy danh sách quảng cáo: " + e.getMessage(), null);
        }
    }
    @GetMapping("/active-today")
    public ResponseData<?> getActiveAdsToday() {
        try {
            List<EventAdsResponse> result = eventAdsService.getActiveAdsToday();
            return new ResponseData<>(200, "Danh sách quảng cáo đang chạy", result);
        } catch (Exception e) {
            return new ResponseData<>(500, "Lỗi: " + e.getMessage(), null);
        }
    }

    @GetMapping("/{id}")
    public ResponseData<?> getAdDetails(@PathVariable Integer id) {
        EventAds ads = eventAdsService.getById(id);
        EventAdsResponse response = eventAdsService.toResponse(ads);
        return new ResponseData<>(200, "Lấy chi tiết thành công", response);
    }

    @PutMapping("/review/{adsId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<?> reviewAds(@PathVariable Integer adsId,
                                     @RequestParam EventAds.AdsStatus status,
                                     @RequestParam(required = false) String reason) {
        try {
            eventAdsService.reviewAds(adsId, status, reason);
            return new ResponseData<>(200, "Xử lý duyệt quảng cáo thành công", null);
        } catch (IllegalArgumentException e) {
            return new ResponseData<>(400, e.getMessage(), null);
        } catch (Exception e) {
            return new ResponseData<>(500, "Lỗi xử lý duyệt: " + e.getMessage(), null);
        }
    }
}
