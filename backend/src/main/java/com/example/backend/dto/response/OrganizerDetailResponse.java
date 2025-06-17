package com.example.backend.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganizerDetailResponse {
    private String orgName;
    private String website;
    private String businessField;
    private String orgInfo;
    private String experience;

    private String orgLogoUrl;
    private String idCardFrontUrl;
    private String idCardBackUrl;
    private String businessLicenseUrl;
}
