package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewReplyResponse {
    private Integer id;
    private Integer reviewId;
    private Integer organizerId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // getters & setters
}