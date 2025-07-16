package com.example.backend.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OllamaRequest {
    private String model;
    private String prompt;
    private boolean stream;

}
