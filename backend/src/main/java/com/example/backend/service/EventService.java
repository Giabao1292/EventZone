package com.example.backend.service;

import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.EventResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Category;
import com.example.backend.model.Event;
import com.example.backend.model.EventStatus;
import com.example.backend.model.Organizer;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.OrganizerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    private final OrganizerRepository organizerRepository;
    public List<EventResponse> getPosterImagesByCategory(int categoryId) {
        List<Event> events = eventRepository.findByCategory_CategoryId(categoryId);
        return events.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryResponse(c.getCategoryId(), c.getCategoryName()))
                .toList();
    }

    private EventResponse mapToEventResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getPosterImage(),
                event.getEventTitle(),
                event.getStartTime()
        );
    }
    public Event createEvent(EventRequest request) {
        Organizer organizer = organizerRepository.findById(request.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Organizer"));
        Event event = new Event();
        event.setOrganizer(organizer);
        event.setEventTitle(request.getEventTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        Category category = new Category();
        category.setCategoryId(request.getCategoryId());
        event.setCategory(category);
        event.setStatusId(1);
        event.setAgeRating(request.getAgeRating());
        event.setBannerText(request.getBannerText());
        event.setHeaderImage(request.getHeaderImage());
        event.setPosterImage(request.getPosterImage());
        event.setCreatedBy("system");
        event.setModifiedBy("system");

        return eventRepository.save(event);
    }
    public Event submitEvent(int eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        event.setStatusId(2);
        return eventRepository.save(event);
    }
    public Event findById(Integer id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id = " + id));
    }
}
