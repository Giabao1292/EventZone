package com.example.backend.controller;

import com.example.backend.dto.request.EventRescheduleRequestDTO;
import com.example.backend.dto.response.EventRescheduleRequestResponseDTO;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.User;
import com.example.backend.service.EventRescheduleRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-reschedule-requests")
@RequiredArgsConstructor
public class EventRescheduleRequestController {

    private final EventRescheduleRequestService rescheduleService;

    /**
     * Tạo yêu cầu dời lịch (chỉ Organizer)
     */
    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping
    public ResponseEntity<ResponseData<EventRescheduleRequestResponseDTO>> createRequest(
            @Valid @RequestBody EventRescheduleRequestDTO requestDTO,
            Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Integer organizerId = currentUser.getId();

            EventRescheduleRequestResponseDTO createdRequest = rescheduleService.createRequest(requestDTO, organizerId);
            return ResponseEntity.ok(new ResponseData<>(200, "Tạo yêu cầu thành công", createdRequest));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseData<>(500, "Lỗi tạo yêu cầu: " + e.getMessage(), null));
        }
    }

    /**
     * Lấy danh sách yêu cầu (Admin) - có thể lọc theo trạng thái
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ResponseData<List<EventRescheduleRequestResponseDTO>>> getRequests(
            @RequestParam(required = false) String status) {
        try {
            List<EventRescheduleRequestResponseDTO> requests = rescheduleService.getRequestsByStatus(status);
            return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách yêu cầu thành công", requests));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseData<>(500, "Lỗi lấy danh sách yêu cầu: " + e.getMessage(), null));
        }
    }

    /**
     * Lấy chi tiết 1 yêu cầu (Admin hoặc Organizer)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<EventRescheduleRequestResponseDTO>> getRequestById(@PathVariable Integer id) {
        try {
            EventRescheduleRequestResponseDTO request = rescheduleService.getRequestById(id);
            return ResponseEntity.ok(new ResponseData<>(200, "Lấy chi tiết yêu cầu thành công", request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseData<>(404, "Không tìm thấy yêu cầu: " + e.getMessage(), null));
        }
    }

    /**
     * Duyệt yêu cầu (Admin)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<ResponseData<Void>> approveRequest(
            @PathVariable Integer id,
            @RequestParam Integer adminUserId) {
        try {
            rescheduleService.approveRequest(id, adminUserId);
            return ResponseEntity.ok(new ResponseData<>(200, "Duyệt yêu cầu thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseData<>(500, "Lỗi duyệt yêu cầu: " + e.getMessage(), null));
        }
    }

    /**
     * Từ chối yêu cầu (Admin)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<ResponseData<Void>> rejectRequest(
            @PathVariable Integer id,
            @RequestParam Integer adminUserId,
            @RequestParam String adminNote) {
        try {
            rescheduleService.rejectRequest(id, adminUserId, adminNote);
            return ResponseEntity.ok(new ResponseData<>(200, "Từ chối yêu cầu thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseData<>(500, "Lỗi từ chối yêu cầu: " + e.getMessage(), null));
        }
    }

    /**
     * Lấy danh sách yêu cầu theo event (Admin)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/event/{eventId}")
    public ResponseEntity<ResponseData<List<EventRescheduleRequestResponseDTO>>> getRequestsByEventId(@PathVariable Integer eventId) {
        try {
            List<EventRescheduleRequestResponseDTO> requests = rescheduleService.getRequestsByEventId(eventId);
            return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách yêu cầu theo event thành công", requests));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseData<>(500, "Lỗi lấy danh sách yêu cầu: " + e.getMessage(), null));
        }
    }
}
