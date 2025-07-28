package com.example.backend.service;

import com.example.backend.dto.request.EventHomeDTO;
import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.request.UpdateStatusEvent;
import com.example.backend.dto.response.*;
import com.example.backend.model.Event;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface EventService {

    List<Event> getApprovedEvents();

    Map<String, List<EventHomeDTO>> getHomeEventsGroupedByStatus();

    List<EventResponse> getPosterImagesByCategory(int categoryId);

    Event createEvent(EventRequest request);

    Event submitEvent(int eventId);

    EventDetailDTO getEventDetailById(int eventId, String userEmail);

    PageResponse<EventSummaryAdmin> searchEvent(Pageable pageable, String... search);

    EventDetailAdmin getEventDetailAdmin(int eventId);

    Event editEvent(int eventId, EventRequest request);

    List<Event> findEventsByOrganizerId(int organizerId);

    List<Event> getEventsByStatus(Integer organizerId, Integer statusId);

    void updateStatus(UpdateStatusEvent status, int eventId);

    Event findById(Integer id);

    List<EventHomeDTO> userSearchEvent(String[] search);

    FeaturedEventResponse getFeaturedEventsForHome();

    List<EventHomeDTO> recommendEvents(String email);

    List<EventResponse> getEventsForReviewByCategory(int categoryId);

    PageResponse<EventResponse> getEventsForReviewAllCategoriesPaged(int page, int size, String search, Integer categoryId);

    List<EventHomeDTO> getTopEvents(Pageable pageable);

    List<EventSummaryAdmin> getEventsWithReviews();

    List<Event> findMyEventsWithReviews(int organizerId);
}
