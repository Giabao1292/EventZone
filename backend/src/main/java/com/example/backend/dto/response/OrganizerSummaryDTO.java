package com.example.backend.dto.response;

import com.example.backend.util.StatusOrganizer;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerSummaryDTO {
    private Integer id;
    private String orgName;
    private String orgType;
    private String orgAddress;
    private String fullName;
    private String email;
    private String address;
    private Instant createdAt;
    private StatusOrganizer status;
}
