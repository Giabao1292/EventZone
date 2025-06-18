
  package com.example.backend.controller;

    import com.example.backend.dto.request.EventRequest;
    import com.example.backend.dto.response.CategoryResponse;
    import com.example.backend.dto.response.EventDetailDTO;
    import com.example.backend.dto.response.EventResponse;
    import com.example.backend.dto.response.ResponseData;
    import com.example.backend.model.Category;
    import com.example.backend.model.Event;
    import com.example.backend.repository.CategoryRepository;
    import com.example.backend.repository.EventRepository;
    import com.example.backend.service.EventService;
    import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Sort;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.util.HashMap;
    import java.util.List;
    import java.util.stream.Collectors;


    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/events")
    public class EventController {
        private final EventService eventService;
        private final CategoryRepository categoryRepository;

        @PreAuthorize("hasRole('ORGANIZER')")
        @PostMapping("/create")
        public ResponseData<?> createEvent(@RequestBody @Valid EventRequest request) {
            Event createdEvent = eventService.createEvent(request);

            var responseData = new HashMap<String, Object>();
            responseData.put("eventId", createdEvent.getId());

            return new ResponseData<>(HttpStatus.CREATED.value(), "Sự kiện được tạo thành công", responseData);
        }
        @PreAuthorize("hasRole('ORGANIZER')")
        @PostMapping("/save/{eventId}")
        public ResponseData<?> submitEvent(@PathVariable int eventId) {
            Event submittedEvent = eventService.submitEvent(eventId);
            return new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Event submitted successfully with PENDING status",
                    submittedEvent
            );
        }

        @GetMapping("/detail/{eventId}")
        public ResponseEntity<ResponseData<EventDetailDTO>> getEventDetail(@PathVariable int eventId) {
            EventDetailDTO detail = eventService.getEventDetailById(eventId);

            if (detail == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseData<>(404, "Không tìm thấy sự kiện", null));
            }

            return ResponseEntity.ok(
                    new ResponseData<>(200, "Lấy thông tin chi tiết sự kiện thành công", detail)
            );
        }


    }
