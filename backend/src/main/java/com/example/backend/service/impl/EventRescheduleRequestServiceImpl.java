package com.example.backend.service.impl;

import com.example.backend.dto.request.EventRescheduleRequestDTO;
import com.example.backend.dto.response.EventRescheduleRequestResponseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.EventRescheduleRequestService;
import com.example.backend.service.MailService;
import com.example.backend.service.NotificationService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventRescheduleRequestServiceImpl implements EventRescheduleRequestService {

    private final EventRescheduleRequestRepository requestRepository;
    private final EventRepository eventRepository;
    private final ShowingTimeRepository showingTimeRepository;
    private final EventStatusRepository eventStatusRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final MailService mailService;
    private final BookingRepository bookingRepository;

    @Override
    public EventRescheduleRequestResponseDTO createRequest(EventRescheduleRequestDTO dto, Integer currentUserId) {
        ShowingTime showingTime = showingTimeRepository.findById(dto.getShowingTimeId())
                .orElseThrow(() -> new ResourceNotFoundException("ShowingTime not found"));

        if ("RESCHEDULE_PENDING".equals(showingTime.getStatus().name())) {
            throw new IllegalStateException("Suất chiếu này đã có yêu cầu dời lịch đang chờ xử lý!");
        }

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        Organizer organizer = event.getOrganizer();
        if (!organizer.getUser().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("Bạn không có quyền tạo yêu cầu cho sự kiện này");
        }

        showingTime.setStatus(ShowingTimeStatus.RESCHEDULE_PENDING);
        showingTimeRepository.save(showingTime);

        EventStatus pendingStatus = eventStatusRepository.findByStatusName("PENDING")
                .orElseThrow(() -> new ResourceNotFoundException("Status PENDING not found"));

        EventRescheduleRequest entity = new EventRescheduleRequest();
        entity.setEvent(event);
        entity.setShowingTime(showingTime);
        entity.setOldStartTime(dto.getOldStartTime());
        entity.setOldEndTime(dto.getOldEndTime());
        entity.setRequestedStartTime(dto.getRequestedStartTime());
        entity.setRequestedEndTime(dto.getRequestedEndTime());
        entity.setRequestedBy(organizer.getUser());
        entity.setReason(dto.getReason());
        entity.setStatus(pendingStatus);
        entity.setRequestedAt(LocalDateTime.now());

        EventRescheduleRequest saved = requestRepository.save(entity);
        return mapToDTO(saved);
    }

    @Override
    public List<EventRescheduleRequestResponseDTO> getRequestsByStatus(String status) {
        List<EventRescheduleRequest> entities;
        if (status == null || status.isEmpty()) {
            entities = requestRepository.findAll();
        } else {
            entities = requestRepository.findByStatus_StatusName(status);
        }
        return entities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveRequest(Integer requestId, Integer adminUserId) {
        log.info("Start approving request with ID: {}", requestId);

        EventRescheduleRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        log.info("Current status of request {}: {}", requestId, request.getStatus().getStatusName());

        if (!"PENDING".equals(request.getStatus().getStatusName())) {
            log.warn("Request {} status is not PENDING, cannot approve", requestId);
            throw new IllegalStateException("Request is not pending");
        }

        EventStatus approvedStatus = eventStatusRepository.findByStatusName("APPROVED")
                .orElseThrow(() -> new ResourceNotFoundException("Status APPROVED not found"));
        log.info("Status APPROVED found with id: {}", approvedStatus.getId());

        request.setStatus(approvedStatus);

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        log.info("Admin user found with ID: {}", adminUserId);

        request.setApprovedBy(admin);
        request.setRespondedAt(LocalDateTime.now());

        // Lấy thời gian cũ trước khi update
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");
        String oldStartTimeStr = request.getShowingTime().getStartTime().format(formatter);
        String oldEndTimeStr = request.getShowingTime().getEndTime().format(formatter);

        // Cập nhật lại ShowingTime theo lịch mới
        ShowingTime showingTime = request.getShowingTime();
        log.info("Updating ShowingTime id: {} to new start: {}, new end: {}",
                showingTime.getId(), request.getRequestedStartTime(), request.getRequestedEndTime());

        showingTime.setStartTime(request.getRequestedStartTime());
        showingTime.setEndTime(request.getRequestedEndTime());
        showingTime.setStatus(ShowingTimeStatus.ACTIVE);
        showingTimeRepository.save(showingTime);
        log.info("ShowingTime updated and saved.");

        requestRepository.save(request);
        log.info("Request updated and saved.");

        //gửi thông báo cho nhà tổ chức
        notificationService.notifyRescheduleApproved(
                request.getRequestedBy(),
                request.getEvent().getEventTitle(),
                oldStartTimeStr,
                oldEndTimeStr,
                request.getRequestedStartTime().format(formatter),
                request.getRequestedEndTime().format(formatter),
                "/organizer/events"
        );

        try {
            // Gửi mail duyệt yêu cầu cho người tạo yêu cầu
            log.info("Gửi mail duyệt yêu cầu cho user: {}", request.getRequestedBy().getEmail());
            // Gửi mail duyệt yêu cầu cho người tạo yêu cầu (organizer)
            mailService.sendApproveRescheduleToOrganizer(
                    request.getRequestedBy().getEmail(),
                    request.getRequestedBy().getFullName(),
                    request.getEvent().getEventTitle(),
                    oldStartTimeStr,
                    oldEndTimeStr,
                    request.getRequestedStartTime().format(formatter),
                    request.getRequestedEndTime().format(formatter)
            );


            log.info("Gửi mail duyệt yêu cầu thành công");

            // Lấy danh sách Booking CONFIRMED
            List<Booking> confirmedBookings = bookingRepository.findByShowingTimeIdAndPaymentStatus(
                    showingTime.getId(), "CONFIRMED"
            );
            // Lọc ra danh sách User duy nhất
            List<User> buyers = confirmedBookings.stream()
                    .map(Booking::getUser)
                    .filter(u -> u != null)
                    .distinct()
                    .toList();

            // Gửi thông báo notification cho từng người mua vé thành công
            notificationService.notifyRescheduleToBuyers(
                    buyers,
                    request.getEvent().getEventTitle(),
                    oldStartTimeStr,
                    oldEndTimeStr,
                    request.getRequestedStartTime().format(formatter),
                    request.getRequestedEndTime().format(formatter),
                    "/events/28" // hoặc đường dẫn chi tiết sự kiện
            );

            // Gửi mail cho từng người mua vé
            for (User attendee : buyers) {
                if (attendee.getEmail() != null) {
                    mailService.sendRescheduleEmailAsync(
                            attendee.getEmail(),
                            request.getEvent().getEventTitle(),
                            oldStartTimeStr,
                            oldEndTimeStr,
                            request.getRequestedStartTime().format(formatter),
                            request.getRequestedEndTime().format(formatter)
                    );
                }
            }
            log.info("Đã gửi mail và thông báo dời lịch cho {} người mua vé.", buyers.size());
        } catch (Exception e) {
            log.error("Lỗi khi gửi mail/thông báo dời lịch", e);
        }

        log.info("Finished approving request with ID: {}", requestId);
    }





    @Override
    @Transactional
    public void rejectRequest(Integer requestId, Integer adminUserId, String rejectReason) {
        // Lấy request
        EventRescheduleRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Lấy status REJECTED
        EventStatus rejectedStatus = eventStatusRepository.findByStatusName("REJECTED")
                .orElseThrow(() -> new ResourceNotFoundException("Status REJECTED not found"));
        request.setStatus(rejectedStatus);

        // Lấy admin duyệt
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        request.setApprovedBy(admin);

        // Ghi chú lý do từ chối và thời gian duyệt
        request.setAdminNote(rejectReason);
        request.setRespondedAt(LocalDateTime.now());
        requestRepository.save(request);

        // Đảm bảo suất chiếu ACTIVE lại (nếu BE bạn cần)
        ShowingTime showingTime = showingTimeRepository.findById(request.getShowingTime().getId())
                .orElseThrow(() -> new ResourceNotFoundException("ShowingTime not found"));
        showingTime.setStatus(ShowingTimeStatus.ACTIVE);
        showingTimeRepository.save(showingTime);

        // Gửi notification cho người tạo yêu cầu (organizer)
        User organizer = request.getRequestedBy();
        String eventTitle = request.getEvent().getEventTitle();

        notificationService.notifyRescheduleRejected(
                organizer,
                eventTitle,
                rejectReason,
                "/organizer/events" // Đường dẫn xem chi tiết/lịch sử yêu cầu, FE customize nếu muốn
        );

        // Gửi email từ chối (tuỳ chọn, nên để trong try-catch)
        try {
            mailService.sendRejectRescheduleEmail(
                    request.getRequestedBy().getEmail(),
                    request.getRequestedBy().getFullName(),
                    eventTitle,
                    rejectReason
            );
        } catch (Exception e) {
            log.error("Gửi email từ chối dời lịch thất bại cho organizer {}: {}", organizer.getEmail(), e.getMessage());
        }
    }


    @Override
    public EventRescheduleRequestResponseDTO getRequestById(Integer requestId) {
        EventRescheduleRequest entity = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        return mapToDTO(entity);
    }

    @Override
    public List<EventRescheduleRequestResponseDTO> getRequestsByEventId(Integer eventId) {
        List<EventRescheduleRequest> list = requestRepository.findByEventId(eventId);
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private EventRescheduleRequestResponseDTO mapToDTO(EventRescheduleRequest req) {
        return new EventRescheduleRequestResponseDTO(
                req.getId(),
                req.getEvent().getId(),
                req.getEvent().getEventTitle(),
                req.getShowingTime().getId(),
                req.getOldStartTime(),
                req.getOldEndTime(),
                req.getRequestedStartTime(),
                req.getRequestedEndTime(),
                req.getReason(),
                req.getStatus().getStatusName(),
                req.getRequestedBy().getFullName(),
                req.getRequestedAt(),
                req.getApprovedBy() != null ? req.getApprovedBy().getFullName() : null,
                req.getRespondedAt(),
                req.getAdminNote()
        );
    }
}
