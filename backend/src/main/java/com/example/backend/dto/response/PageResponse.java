package com.example.backend.dto.response;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {
    int totalElements;
    int totalPages;
    int number;
    int size;
    List<T> content;
}
