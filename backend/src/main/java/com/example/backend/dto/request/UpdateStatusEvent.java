package com.example.backend.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStatusEvent {
    private String rejectionReason;
    private String status;
}
