package com.example.backend.service;

import com.example.backend.dto.request.EventRescheduleRequestDTO;
import com.example.backend.dto.response.EventRescheduleRequestResponseDTO;

import java.util.List;

public interface EventRescheduleRequestService {
    EventRescheduleRequestResponseDTO createRequest(EventRescheduleRequestDTO dto, Integer organizerId);

    List<EventRescheduleRequestResponseDTO> getRequestsByStatus(String status);

    void approveRequest(Integer requestId, Integer adminUserId);

    void rejectRequest(Integer requestId, Integer adminUserId, String rejectReason);

    EventRescheduleRequestResponseDTO getRequestById(Integer requestId);

    List<EventRescheduleRequestResponseDTO> getRequestsByEventId(Integer eventId);


}
