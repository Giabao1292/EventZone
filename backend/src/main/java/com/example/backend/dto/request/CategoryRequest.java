package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "The name category cannot be left blank.")
    @Size(max = 100, message = "Category name maximum 100 characters")
    private String categoryName;
}
