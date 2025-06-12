package com.example.backend.controller;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.EventResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.CategoryService;
import com.example.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final EventService eventService;
    private final CategoryRepository categoryRepository;

    @GetMapping("")
    public ResponseData<List<CategoryResponse>> getAllCategories() {
            List<CategoryResponse> categories = categoryService.getAllCategories();
            return new ResponseData<>(HttpStatus.OK.value(), "Fetched categories", categories);
    }
    @GetMapping("/{categoryId}/poster-images")
    public ResponseData<List<EventResponse>> getPosterImagesByCategory(@PathVariable int categoryId) {
        List<EventResponse> result = eventService.getPosterImagesByCategory(categoryId);
        return new ResponseData<>(HttpStatus.OK.value(), "Fetched categories", result);
    }
}
