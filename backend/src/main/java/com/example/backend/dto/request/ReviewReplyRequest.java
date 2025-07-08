package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewReplyRequest {
    @NotNull
    private Integer reviewId;

    @NotNull
    private Integer organizerId;

    @NotNull
    @Size(min = 1, max = 1000)
    private String content;

    // getters & setters
}




