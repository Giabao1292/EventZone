package com.example.backend.controller;

import com.example.backend.dto.response.EventResponse;
import com.example.backend.model.Event;
import com.example.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor

public class EventController {

    private final EventService eventService;

    @GetMapping("")
    public ResponseEntity<Page<EventResponse>> getEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int limit
    ) {
        Page<EventResponse> eventsPage = eventService.getEvents(page, limit);
        return ResponseEntity.ok(eventsPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable("id") int eventId) {
        return eventService.getEventById(eventId)
                .map(event -> new EventResponse(event.getId(), event.getPosterImage()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
