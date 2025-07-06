package com.example.backend.dto.response;

import java.time.LocalDateTime;

public record EventTrackingDTO(
        Integer eventId,
        String eventTitle,
        LocalDateTime startTime,
        String posterImage
) {}
