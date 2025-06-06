package com.example.backend.service;

import com.example.backend.dto.response.EventResponse;
import com.example.backend.model.Event;
import com.example.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class EventService {
    private final EventRepository eventRepository;

    public Page<EventResponse> getEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> eventsPage = eventRepository.findAll(pageable);

        return eventsPage.map(event -> new EventResponse(
                event.getId(),
                event.getPosterImage()
        ));
    }


    public Optional<Event> getEventById(int id) {
        return eventRepository.findById(id);
    }
}
