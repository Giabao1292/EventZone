
package com.example.backend.controller;

import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.response.EventDetailAdmin;
import com.example.backend.dto.response.EventDetailDTO;
import com.example.backend.dto.response.EventSummaryAdmin;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.Event;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.EventService;
import com.example.backend.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final CategoryRepository categoryRepository;
    private final VNPayService vnpayService;
    private final PayOS payOS;

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/create")
    public ResponseData<?> createEvent(@RequestBody @Valid EventRequest request) {
        Event createdEvent = eventService.createEvent(request);
        var responseData = new HashMap<String, Object>();
        responseData.put("eventId", createdEvent.getId());
        return new ResponseData<>(HttpStatus.CREATED.value(), "Bản Nháp sự kiện được tạo thành công", responseData);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/save/{eventId}")
    public ResponseData<?> submitEvent(@PathVariable int eventId) {
        Event submittedEvent = eventService.submitEvent(eventId);
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Event submitted successfully with PENDING status",
                submittedEvent
        );
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/deposit")
    public ResponseData<?> createDeposit(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer eventId = (Integer) body.get("eventId");
        String paymentMethod = (String) body.get("paymentMethod");
        Integer amount = (Integer) body.get("amount");
        String description = (String) body.get("description");

        try {
            String checkoutUrl;
            String paymentId;

            if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
                PaymentData paymentData = PaymentData.builder()
                        .orderCode(eventId.longValue())
                        .amount(amount)
                        .description(description)
                        .returnUrl("http://localhost:5173/deposit-result?eventId=" + eventId)
                        .cancelUrl("http://localhost:5173/deposit-cancel")
                        .build();
                CheckoutResponseData payosData = payOS.createPaymentLink(paymentData);
                checkoutUrl = payosData.getCheckoutUrl();
                paymentId = String.valueOf(payosData.getOrderCode());
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                checkoutUrl = vnpayService.createPaymentUrlEvent(eventId, amount, description, request);
                paymentId = String.valueOf(eventId);
            } else {
                throw new IllegalArgumentException("Invalid payment method");
            }

            return new ResponseData<>(200, "Deposit link created successfully", Map.of(
                    "checkoutUrl", checkoutUrl,
                    "paymentId", paymentId
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Error creating deposit link: " + e.getMessage(), null);
        }
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/deposit/verify")
    public ResponseData<?> verifyDeposit(
            @RequestParam Integer eventId,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String vnp_ResponseCode) {
        try {
            boolean isPaid;
            if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
                PaymentLinkData payment = payOS.getPaymentLinkInformation(Long.valueOf(eventId));
                isPaid = "PAID".equalsIgnoreCase(payment.getStatus());
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                isPaid = "00".equals(vnp_ResponseCode);
            } else {
                throw new IllegalArgumentException("Invalid payment method");
            }

            if (isPaid) {
                Event submittedEvent = eventService.submitEvent(eventId);
                return new ResponseData<>(200, "Deposit payment successful, event submitted", submittedEvent.getId());
            } else {
                return new ResponseData<>(400, "Deposit payment not completed", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Error verifying deposit: " + e.getMessage(), null);
        }
    }

    @GetMapping("/detail/{eventId}")
    public ResponseEntity<ResponseData<EventDetailDTO>> getEventDetail(@PathVariable int eventId) {
        EventDetailDTO detail = eventService.getEventDetailById(eventId);

        if (detail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseData<>(404, "Không tìm thấy sự kiện", null));
        }

        return ResponseEntity.ok(
                new ResponseData<>(200, "Lấy thông tin chi tiết sự kiện thành công", detail)
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseData<List<EventSummaryAdmin>> searchEvent(Pageable pageable, @RequestParam(name = "search", required = false) String... search) {
        List<EventSummaryAdmin> listEvents = eventService.searchEvent(pageable, search);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list of events", listEvents);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseData<EventDetailAdmin> getEvenDetail(@PathVariable("id") int eventId) {
        EventDetailAdmin detail = eventService.getEventDetailAdmin(eventId);
        return new ResponseData<>(HttpStatus.OK.value(), "Get even detail successfully", detail);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseData<?> updateEvent(@PathVariable("id") int eventId, @RequestParam("status") String status) {
//        eventService.updateStatus();
        return null;
    }
}