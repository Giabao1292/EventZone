package com.example.backend.controller;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    @GetMapping("/categories")
    public ResponseData<List<CategoryResponse>> getAllCategories() {
            List<CategoryResponse> categories = categoryService.getAllCategories();
            return new ResponseData<>(HttpStatus.OK.value(), "Fetched categories", categories);
    }
}
