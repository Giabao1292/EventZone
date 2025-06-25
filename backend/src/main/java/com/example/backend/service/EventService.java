package com.example.backend.service;

import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.response.*;
import com.example.backend.model.Event;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventService {

    List<EventResponse> getPosterImagesByCategory(int categoryId);

    Event createEvent(EventRequest request);

    Event submitEvent(int eventId);

    EventDetailDTO getEventDetailById(int eventId);

    List<EventSummaryAdmin> searchEvent(Pageable pageable, String... search);

    EventDetailAdmin getEventDetailAdmin(int eventId);
}