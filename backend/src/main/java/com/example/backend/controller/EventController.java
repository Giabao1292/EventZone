
package com.example.backend.controller;

import com.example.backend.dto.request.EventHomeDTO;
import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.request.UpdateStatusEvent;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Event;
import com.example.backend.model.Organizer;
import com.example.backend.repository.EventRepository;
import com.example.backend.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import java.time.LocalDateTime;
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
        Map<String, List<EventHomeDTO>> result = eventService.getHomeEventsGroupedByStatus();
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
                        .orderCode(System.currentTimeMillis())
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
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
            }

            return new ResponseData<>(200, "Tạo liên kết đặt cọc thành công", Map.of(
                    "checkoutUrl", checkoutUrl,
                    "paymentId", paymentId
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Lỗi tạo liên kết đặt cọc: " + e.getMessage(), null);
        }
    }

    @GetMapping("/deposit/verify")
    public ResponseData<?> verifyDeposit(
            @RequestParam Integer eventId,
            @RequestParam(value = "orderCode", required = false) String orderCode,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String vnp_ResponseCode) {
        try {
            boolean isPaid;
            if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
                PaymentLinkData payment = payOS.getPaymentLinkInformation(Long.valueOf(orderCode));
                isPaid = "PAID".equalsIgnoreCase(payment.getStatus());
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                isPaid = "00".equals(vnp_ResponseCode);
            } else {
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
            }

            if (isPaid) {
                Event submittedEvent = eventService.submitEvent(eventId);
                return new ResponseData<>(200, "Thanh toán đặt cọc thành công, sự kiện đã được gửi", submittedEvent.getId());
            } else {
                return new ResponseData<>(400, "Thanh toán đặt cọc chưa hoàn thành", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(500, "Lỗi xác minh đặt cọc: " + e.getMessage(), null);
        }
    }

    @GetMapping("/detail/{eventId}")
    public ResponseEntity<ResponseData<EventDetailDTO>> getEventDetail(
            @PathVariable int eventId,
            Authentication authentication
    ) {
        String userEmail = authentication != null ? authentication.getName() : null;
        EventDetailDTO dto = eventService.getEventDetailById(eventId, userEmail);
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy chi tiết sự kiện thành công", dto));
    }

    @GetMapping("/recommend")
    public ResponseEntity<ResponseData<List<EventHomeDTO>>> recommendEvents(
            Authentication authentication) {
        try {
            String email = authentication.getName();

            List<EventHomeDTO> recommendations = eventService.recommendEvents(email);

            return ResponseEntity.ok(new ResponseData<>(200, "Gợi ý sự kiện thành công", recommendations));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseData<>(500, "Lỗi khi gọi Flask model: " + e.getMessage(), null));
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
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
    public ResponseEntity<ResponseData<Map<String, Object>>> editEvent(
            @PathVariable int eventId,
            @RequestBody @Valid EventRequest request) {

        try {
            Event updatedEvent = eventService.editEvent(eventId, request);
            
            // Tạo response data với event và showing times
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("eventId", updatedEvent.getId());
            
            // Thêm showing times với ID đã được tạo
            if (updatedEvent.getTblShowingTimes() != null && !updatedEvent.getTblShowingTimes().isEmpty()) {
                List<Map<String, Object>> showingTimesData = updatedEvent.getTblShowingTimes().stream()
                    .map(st -> {
                        Map<String, Object> stData = new HashMap<>();
                        stData.put("id", st.getId());
                        stData.put("startTime", st.getStartTime());
                        stData.put("endTime", st.getEndTime());
                        stData.put("saleOpenTime", st.getSaleOpenTime());
                        stData.put("saleCloseTime", st.getSaleCloseTime());
                        stData.put("layoutMode", st.getLayoutMode());
                        
                        if (st.getAddress() != null) {
                            Map<String, Object> addressData = new HashMap<>();
                            addressData.put("id", st.getAddress().getId());
                            addressData.put("venueName", st.getAddress().getVenueName());
                            addressData.put("location", st.getAddress().getLocation());
                            addressData.put("city", st.getAddress().getCity());
                            stData.put("address", addressData);
                        }
                        
                        return stData;
                    })
                    .collect(java.util.stream.Collectors.toList());
                responseData.put("showingTimes", showingTimesData);
            }
            
            return ResponseEntity
                    .ok(new ResponseData<>(200, "Chỉnh sửa thông tin sự kiện thành công", responseData));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ResponseData<>(404, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseData<>(400, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseData<>(500, "Lỗi hệ thống khi chỉnh sửa sự kiện", null));
        }
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


    @GetMapping("/organizer/{organizerId}/status/{statusId}")
    public ResponseEntity<ResponseData<List<EventSummaryDTO>>> getEventsByStatus(
            @PathVariable Integer organizerId,
            @PathVariable Integer statusId) {
        List<Event> events = eventService.getEventsByStatus(organizerId, statusId);
        List<EventSummaryDTO> eventDTOs = events.stream()
                .map(EventSummaryDTO::new)
                .toList();

        return ResponseEntity.ok(
                new ResponseData<>(200, "Lấy danh sách sự kiện theo trạng thái thành công", eventDTOs)
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
    public ResponseData<List<ShowingTimeAdmin>> getShowingTime(@PathVariable int eventId) {
        List<ShowingTimeAdmin> showingTimeAdminList = showingTimeService.getListShowingTime(eventId);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list showing time successful", showingTimeAdminList);
    }

    @GetMapping("/public")
    public ResponseData<List<EventHomeDTO>> userSearchEvents(@RequestParam(name = "search", required = false) String... search) {
        List<EventHomeDTO> listEvents = eventService.userSearchEvent(search);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list of events", listEvents);
    }


    @GetMapping("/reviewable")
    public ResponseEntity<ResponseData<List<EventResponse>>> getEventsForReviewByCategory(
            @RequestParam int categoryId) {
        List<EventResponse> responses = eventService.getEventsForReviewByCategory(categoryId);
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy sự kiện review thành công", responses));
    }

    @GetMapping("/reviewable/all")
    public ResponseEntity<ResponseData<PageResponse<EventResponse>>> getEventsForReviewAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer categoryId
    ) {
        PageResponse<EventResponse> responses = eventService.getEventsForReviewAllCategoriesPaged(page, size, search, categoryId);
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy sự kiện review thành công", responses));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/top")
    public ResponseData<List<EventHomeDTO>> getTopEvents(Pageable pageable) {
        List<EventHomeDTO> listEvents = eventService.getTopEvents(pageable);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list of events", listEvents);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/with-reviews")
    public ResponseData<List<EventSummaryAdmin>> getEventsWithReviews() {
        List<EventSummaryAdmin> eventsWithReviews = eventService.getEventsWithReviews();
        return new ResponseData<>(HttpStatus.OK.value(), "Get events with reviews", eventsWithReviews);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/my-events-with-reviews")
    public ResponseData<List<EventSummaryDTO>> getMyEventsWithReviews(Authentication authentication) {
        String email = authentication.getName();
        System.out.println("EMAIL từ token: " + email);

        Organizer organizer = organizerService.getOrganizerByEmail(email);
        if (organizer == null) {
            return new ResponseData<>(404, "Không tìm thấy Organizer với email: " + email, null);
        }
        List<Event> events = eventService.findMyEventsWithReviews(organizer.getId());

        // Map List<Event> -> List<EventSummaryDTO>
        List<EventSummaryDTO> eventDTOs = events.stream()
                .map(EventSummaryDTO::new) // sử dụng constructor EventSummaryDTO(Event event)
                .toList();
        return new ResponseData<>(200, "Lấy danh sách sự kiện có đánh giá thành công", eventDTOs);
    }

}