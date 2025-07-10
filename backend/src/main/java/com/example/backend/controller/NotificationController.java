package com.example.backend.controller;

import com.example.backend.dto.response.NotificationResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.AuthService;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    public ResponseData<List<NotificationResponse>> getAllNotification() {
        List<NotificationResponse> notificationResponses = notificationService.getAllNotifications(authService.getUsername());
        return new ResponseData<>(HttpStatus.OK.value(), "Get list notification successfully!!", notificationResponses);
    }

    @GetMapping("/unread-count")
    public ResponseData<Integer> getUnreadCount() {
        Integer unreadCount = notificationService.countUnread(authService.getUsername());
        return new ResponseData<>(HttpStatus.OK.value(), "Get unread count successfully!!", unreadCount);
    }

    @PatchMapping("/{id}/read")
    public ResponseData<?> readNotification(@PathVariable Long id) {
        notificationService.readNotify(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Read notify successfully!");
    }

    @PatchMapping("/read-all")
    public ResponseData<?> readAllNotification() {
        notificationService.readAll(authService.getUsername());
        return new ResponseData<>(HttpStatus.OK.value(), "Read all notification successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseData<?> deleteNotification(@PathVariable Long id) {
        notificationService.delete(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete notification id " + id + " successfully!");
    }

    @DeleteMapping
    public ResponseData<?> deleteAllNotification() {
        notificationService.deleteAllRead(authService.getUsername());
        return new ResponseData<>(HttpStatus.OK.value(), "Delete all notification read successfully!");
    }
}
