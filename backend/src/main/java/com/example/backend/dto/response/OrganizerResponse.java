package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrganizerResponse {
    private int id;
    private String orgName;
    private String taxCode;
    private String orgAddress;
    private String website;
    private String businessField;
    private String orgInfo;
    private String orgLogoUrl;
    private String idCardFrontUrl;
    private String idCardBackUrl;
    private String businessLicenseUrl;
    private String experience;
}
