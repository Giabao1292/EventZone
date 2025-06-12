package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Setter
@Getter
public class OrganizerRequest {
    @NotBlank(message = "Organization name is required")
    private String name;

    @NotBlank(message = "Organization type is required")
    private String organizationType;

    @NotBlank(message = "Tax or business registration number is required")
    private String taxCode;

    @NotBlank(message = "Address is required")
    private String address;

    @Pattern(regexp = "^(https?://)?[\\w.-]+(?:\\.[\\w.-]+)+[/#?]?.*$",
            message = "Invalid website URL")
    private String website;

    @NotBlank(message = "Primary business sector is required")
    private String businessSector;

    @Size(max = 2000, message = "Description can be up to 2000 characters")
    private String description;

    private MultipartFile idCardFront;
    private MultipartFile idCardBack;
    private MultipartFile businessLicense;
    private MultipartFile logo;
}