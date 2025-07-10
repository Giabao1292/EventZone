package com.example.backend.dto.response;

import com.example.backend.dto.request.EventHomeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeaturedEventResponse {
    private List<EventHomeDTO> ongoing;
    private List<EventHomeDTO> upcoming;
}
