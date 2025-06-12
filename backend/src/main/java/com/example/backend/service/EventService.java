package com.example.backend.service;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.EventResponse;
import com.example.backend.model.Category;
import com.example.backend.model.Event;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CategoryRepository categoryRepository;

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


}
