package com.example.backend.service;

import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.EventDetailDTO;
import com.example.backend.dto.response.EventResponse;
import com.example.backend.model.Event;

import java.util.List;

public interface EventService {

    List<EventResponse> getPosterImagesByCategory(int categoryId);

    Event createEvent(EventRequest request);

    Event submitEvent(int eventId);

    EventDetailDTO getEventDetailById(int eventId);
}
