package com.example.backend.controller;

import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.service.EventService;
import com.example.backend.service.MailService;
import com.example.backend.service.TrackingEventUpcomingService;
import com.example.backend.service.UserService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor

public class TrackingEventUpcomingController {

    private final TrackingEventUpcomingService trackingService;
    private final UserService userService;
    private final EventService eventService;
    private final MailService mailService;

    // Theo dõi sự kiện
    @PostMapping("/track/{eventId}")
    public ResponseEntity<?> trackEvent(@PathVariable Integer eventId, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        Event event = eventService.findById(eventId);
        trackingService.trackEvent(user, event);
        try {
            mailService.sendTrackingEventEmail(user, event); // 👉 Gửi email thông báo
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Theo dõi sự kiện thành công và gửi mail that bai");
        }
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Theo dõi sự kiện thành công", event));
    }

    // Bỏ theo dõi sự kiện
    @DeleteMapping("/untrack/{eventId}")
    public ResponseEntity<?> untrackEvent(@PathVariable Integer eventId, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        Event event = eventService.findById(eventId);
        trackingService.untrackEvent(user, event);
        return ResponseEntity.ok("Đã hủy theo dõi sự kiện.");
    }

    // Kiểm tra đã theo dõi chưa
    @GetMapping("/is-tracking/{eventId}")
    public ResponseEntity<Boolean> isTracking(@PathVariable Integer eventId, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        Event event = eventService.findById(eventId);
        boolean isTracking = trackingService.isTracking(user, event);
        return ResponseEntity.ok(isTracking);
    }

    // Danh sách sự kiện đã theo dõi của user
    @GetMapping("/my-events")
    public ResponseEntity<List<Event>> getTrackedEvents(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<Event> events = trackingService.getTrackedEventsByUser(user);
        return ResponseEntity.ok(events);
    }

    // Danh sách người dùng đang theo dõi 1 sự kiện
    @GetMapping("/event-users/{eventId}")
    public ResponseEntity<List<User>> getUsersTrackingEvent(@PathVariable Integer eventId) {
        Event event = eventService.findById(eventId);
        List<User> users = trackingService.getUsersTrackingEvent(event);
        return ResponseEntity.ok(users);
    }
}
