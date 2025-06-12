    package com.example.backend.controller;

    import com.example.backend.dto.response.CategoryResponse;
    import com.example.backend.dto.response.EventResponse;
    import com.example.backend.model.Category;
    import com.example.backend.model.Event;
    import com.example.backend.repository.CategoryRepository;
    import com.example.backend.repository.EventRepository;
    import com.example.backend.service.EventService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Sort;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.stream.Collectors;


    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api")
    public class EventController {
        @Autowired
        private EventService eventService;
        @Autowired
        private CategoryRepository categoryRepository;

        @GetMapping("/categories/{categoryId}/poster-images")
        public ResponseEntity<List<EventResponse>> getPosterImagesByCategory(@PathVariable int categoryId) {
            List<EventResponse> result = eventService.getPosterImagesByCategory(categoryId);
            return ResponseEntity.ok(result);
        }

        @GetMapping("/categories")
        public ResponseEntity<List<CategoryResponse>> getAllCategories() {
            List<CategoryResponse> list = categoryRepository.findAll(Sort.by("categoryId"))
                    .stream()
                    .map(c -> new CategoryResponse(c.getCategoryId(), c.getCategoryName()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(list);
        }





    }
