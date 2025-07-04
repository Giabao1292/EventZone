package com.example.backend.service;

import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.request.UpdateStatusEvent;
import com.example.backend.dto.response.*;
import com.example.backend.model.Event;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventService {
    List<Event> getApprovedEvents();
    List<EventResponse> getPosterImagesByCategory(int categoryId);

    Event createEvent(EventRequest request);

    Event submitEvent(int eventId);

    EventDetailDTO getEventDetailById(int eventId);

    PageResponse<EventSummaryAdmin> searchEvent(Pageable pageable, String... search);

    EventDetailAdmin getEventDetailAdmin(int eventId);

    Event editEvent(int eventId, EventRequest request);

    List<Event> findEventsByOrganizerId(int organizerId);
    List<Event> getEventsByStatus(Integer organizerId, Integer statusId);
    void updateStatus(UpdateStatusEvent status, int eventId);
}
