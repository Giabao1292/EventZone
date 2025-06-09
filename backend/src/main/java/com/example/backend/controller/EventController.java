package com.example.backend.controller;

import com.example.backend.dto.response.EventResponse;
import com.example.backend.model.Event;
import com.example.backend.repository.EventRepository;
import com.example.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventRepository eventRepository;
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int limit
    ) {
        Page<EventResponse> eventsPage = eventService.getEvents(page, limit);
                Map<String, Object> response = Map.of(
                        "content", eventsPage.getContent(),
                        "currentPage", eventsPage.getNumber(),
                        "totalPages", eventsPage.getTotalPages()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable("id") int eventId) {
        return eventService.getEventById(eventId)
                .map(event -> new EventResponse(event.getId(), event.getPosterImage()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/featured")
    public ResponseEntity<?> updateFeaturedStatus(
            @PathVariable int id,
            @RequestParam boolean featured
    ) {
        Optional<Event> optionalEvent = eventRepository.findById(id);
        if (optionalEvent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Event event = optionalEvent.get();
        event.setIsFeatured(featured);
        eventRepository.save(event);

        return ResponseEntity.ok("Featured status updated");
    }

}
