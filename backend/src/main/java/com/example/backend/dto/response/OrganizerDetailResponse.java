package com.example.backend.dto.response;

import com.example.backend.model.User;
import com.example.backend.util.StatusOrganizer;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganizerDetailResponse {
    private Integer id;
    private String orgName;
    private String website;
    private String businessField;
    private String orgInfo;
    private String experience;
    private String taxCode;
    private String orgAddress;
    private StatusOrganizer status;
    private Instant createdAt;

    private String orgLogoUrl;
    private String idCardFrontUrl;
    private String idCardBackUrl;
    private String businessLicenseUrl;
    
    private User user;
}
