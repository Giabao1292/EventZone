package com.example.backend.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class EventResponse {
    private int eventId;
    private String posterImageUrl;

}
