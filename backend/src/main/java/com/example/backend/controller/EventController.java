
package com.example.backend.controller;

import com.example.backend.dto.request.EventHomeDTO;
import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.request.UpdateStatusEvent;
import com.example.backend.dto.response.*;
import com.example.backend.model.Event;
import com.example.backend.model.Organizer;
import com.example.backend.model.Seat;
import com.example.backend.model.ShowingTime;
import com.example.backend.service.EventService;
import com.example.backend.service.OrganizerService;
import com.example.backend.service.VNPayService;
import com.example.backend.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;


import java.time.LocalDateTime;

import java.util.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final VNPayService vnpayService;
    private final PayOS payOS;
    private final OrganizerService organizerService;
    private final BookingService bookingService;
    private final ShowingTimeService showingTimeService;

    @GetMapping("/home")
    public ResponseEntity<ResponseData<Map<String, List<EventHomeDTO>>>> getHomeEvents() {
        List<Event> events = eventService.getApprovedEvents();
        List<EventHomeDTO> ongoingEvents = new ArrayList<>();
        List<EventHomeDTO> upcomingEvents = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Event event : events) {
            Set<ShowingTime> showings = event.getTblShowingTimes();
            if (showings == null || showings.isEmpty()) continue;

            boolean isOngoing = showings.stream()
                    .anyMatch(st -> st.getSaleOpenTime() != null && st.getSaleCloseTime() != null &&
                            !now.isBefore(st.getSaleOpenTime()) && !now.isAfter(st.getSaleCloseTime()));

            boolean isUpcoming = showings.stream()
                    .allMatch(st -> st.getSaleOpenTime() != null && now.isBefore(st.getSaleOpenTime()));

            OptionalDouble lowestPriceOpt = showings.stream()
                    .flatMap(st -> st.getSeats().stream())
                    .mapToDouble(seat -> seat.getPrice().doubleValue())
                    .min();

            double lowestPrice = lowestPriceOpt.orElse(0);
            EventHomeDTO dto = new EventHomeDTO(event, lowestPrice);

            if (isOngoing) {
                ongoingEvents.add(dto);
            } else if (isUpcoming) {
                upcomingEvents.add(dto);
            }
        }

        Map<String, List<EventHomeDTO>> result = new HashMap<>();
        result.put("ongoing", ongoingEvents);
        result.put("upcoming", upcomingEvents);

        return ResponseEntity.ok(
                new ResponseData<>(200, "Lấy sự kiện trang chủ thành công", result)
        );
    }

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
    public ResponseData<PageResponse<EventSummaryAdmin>> searchEvent(Pageable pageable, @RequestParam(name = "search", required = false) String... search) {
        PageResponse<EventSummaryAdmin> listEvents = eventService.searchEvent(pageable, search);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list of events", listEvents);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseData<EventDetailAdmin> getEvenDetail(@PathVariable("id") int eventId) {
        EventDetailAdmin detail = eventService.getEventDetailAdmin(eventId);
        return new ResponseData<>(HttpStatus.OK.value(), "Get even detail successfully", detail);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseData<?> updateEvent(@PathVariable("id") int eventId, @RequestBody UpdateStatusEvent status) {
        eventService.updateStatus(status, eventId);
        return new ResponseData<>(HttpStatus.OK.value(), "Update status succesfully");
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/edit/{eventId}")
    public ResponseEntity<ResponseData<Integer>> editEvent(@PathVariable int eventId, @RequestBody @Valid EventRequest request) {
        Event updatedEvent = eventService.editEvent(eventId, request);
        if (updatedEvent == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ResponseData<>(404, "Không tìm thấy sự kiện để chỉnh sửa", null));
        }
        return ResponseEntity
                .ok(new ResponseData<>(200, "Chỉnh sửa thông tin sự kiện thành công", updatedEvent.getId()));
    }


    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/myevents")
    public ResponseEntity<ResponseData<List<EventSummaryDTO>>> getMyEvents(Authentication authentication) {
        String email = authentication.getName();
        System.out.println("EMAIL từ token: " + email);

        Organizer organizer = organizerService.getOrganizerByEmail(email);
        if (organizer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseData<>(404, "Không tìm thấy Organizer với email: " + email, null));
        }
        List<Event> events = eventService.findEventsByOrganizerId(organizer.getId());

        // Map List<Event> -> List<EventSummaryDTO>
        List<EventSummaryDTO> eventDTOs = events.stream()
                .map(EventSummaryDTO::new) // sử dụng constructor EventSummaryDTO(Event event)
                .toList();
        return ResponseEntity.ok(
                new ResponseData<>(200, "Lấy danh sách sự kiện thành công", eventDTOs)
        );
    }

    @PreAuthorize("hasAnyRole({'ORGANIZER', 'ADMIN'})")
    @GetMapping("/{eventId}/attendees")
    public ResponseData<PageResponse<AttendeeResponse>> searchAttendee(Pageable pageable, @PathVariable("eventId") int eventId, @RequestParam("startTime") LocalDateTime startTime, String... search) {
        PageResponse<AttendeeResponse> response = bookingService.searchAttendees(pageable, eventId, startTime, search);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list attendees successful", response);
    }
    @PreAuthorize("hasAnyRole({'ORGANIZER', 'ADMIN'})")
    @GetMapping("/{eventId}/analytics")
    public ResponseData<AnalyticAttendeesResponse> getAnalytics(@PathVariable("eventId") int eventId, @RequestParam("startTime") LocalDateTime startTime) {
        AnalyticAttendeesResponse response = bookingService.getAnalytics(eventId, startTime);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list attendees successful", response);
    }
    @PreAuthorize("hasAnyRole({'ORGANIZER', 'ADMIN'})")
    @GetMapping("/{eventId}/showing-times")
    public ResponseData<List<ShowingTimeAdmin>> getShowingTime(@PathVariable int eventId){
        List<ShowingTimeAdmin> showingTimeAdminList = showingTimeService.getListShowingTime(eventId);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list showing time successful", showingTimeAdminList);
    }
}