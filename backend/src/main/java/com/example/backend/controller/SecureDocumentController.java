package com.example.backend.controller;

import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.SecureDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/secure-documents")
public class SecureDocumentController {
    
    private final SecureDocumentService secureDocumentService;
    
    /**
     * Lấy signed URL để truy cập CCCD mặt trước
     */
    @GetMapping("/organizer/{organizerId}/cccd-front")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseData<String> getCCCDFrontUrl(@PathVariable Integer organizerId) {
        String signedUrl = secureDocumentService.getSecureDocumentUrl(organizerId, "front");
        return new ResponseData<>(HttpStatus.OK.value(), "CCCD mặt trước", signedUrl);
    }
    
    /**
     * Lấy signed URL để truy cập CCCD mặt sau
     */
    @GetMapping("/organizer/{organizerId}/cccd-back")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseData<String> getCCCDBackUrl(@PathVariable Integer organizerId) {
        String signedUrl = secureDocumentService.getSecureDocumentUrl(organizerId, "back");
        return new ResponseData<>(HttpStatus.OK.value(), "CCCD mặt sau", signedUrl);
    }
    
    /**
     * Lấy signed URL để truy cập giấy phép kinh doanh
     */
    @GetMapping("/organizer/{organizerId}/business-license")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseData<String> getBusinessLicenseUrl(@PathVariable Integer organizerId) {
        String signedUrl = secureDocumentService.getSecureDocumentUrl(organizerId, "license");
        return new ResponseData<>(HttpStatus.OK.value(), "Giấy phép kinh doanh", signedUrl);
    }
    
    /**
     * Debug endpoint để test URL generation
     */
    @GetMapping("/debug/{organizerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<Object> debugUrl(@PathVariable Integer organizerId) {
        try {
            String frontUrl = secureDocumentService.getSecureDocumentUrl(organizerId, "front");
            String backUrl = secureDocumentService.getSecureDocumentUrl(organizerId, "back");
            String licenseUrl = secureDocumentService.getSecureDocumentUrl(organizerId, "license");
            
            return new ResponseData<>(HttpStatus.OK.value(), "Debug URLs", new Object() {
                public final String front = frontUrl;
                public final String back = backUrl;
                public final String license = licenseUrl;
            });
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        }
    }
} 