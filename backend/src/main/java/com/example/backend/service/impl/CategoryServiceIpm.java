package com.example.backend.service.impl;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceIpm implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryResponse(category.getCategoryId(), category.getCategoryName()))
                .collect(Collectors.toList());
    }
}
