package com.example.backend.util;

import com.example.backend.model.Organizer;
import com.example.backend.repository.OrganizerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Utility để migrate dữ liệu CCCD từ URL sang public_id
 * Chỉ chạy một lần khi cần thiết
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DocumentMigrationUtil {
    
    private final OrganizerRepository organizerRepository;
    
    // Pattern để extract public_id từ Cloudinary URL
    private static final Pattern CLOUDINARY_URL_PATTERN = 
        Pattern.compile("https://res\\.cloudinary\\.com/[^/]+/image/upload/[^/]+/([^.]+)");
    
    // Pattern để extract public_id từ format v{version}/{path}
    private static final Pattern VERSION_PATH_PATTERN = 
        Pattern.compile("v[^/]+/(.+)");
    
    /**
     * Migrate tất cả organizer documents từ URL sang public_id
     */
    public void migrateAllOrganizerDocuments() {
        log.info("Bắt đầu migrate documents cho tất cả organizers...");
        
        List<Organizer> organizers = organizerRepository.findAll();
        int migratedCount = 0;
        int errorCount = 0;
        
        for (Organizer organizer : organizers) {
            try {
                boolean migrated = migrateOrganizerDocuments(organizer);
                if (migrated) {
                    migratedCount++;
                    log.info("Đã migrate documents cho organizer ID: {}", organizer.getId());
                }
            } catch (Exception e) {
                errorCount++;
                log.error("Lỗi khi migrate documents cho organizer ID: {} - {}", 
                    organizer.getId(), e.getMessage());
            }
        }
        
        log.info("Hoàn thành migrate. Thành công: {}, Lỗi: {}", migratedCount, errorCount);
    }
    
    /**
     * Migrate documents cho một organizer cụ thể
     */
    public boolean migrateOrganizerDocuments(Organizer organizer) {
        boolean hasChanges = false;
        
        // Migrate CCCD mặt trước
        if (organizer.getIdCardFrontUrl() != null && 
            organizer.getIdCardFrontUrl().startsWith("http")) {
            String publicId = extractPublicIdFromUrl(organizer.getIdCardFrontUrl());
            if (publicId != null) {
                organizer.setIdCardFrontUrl(publicId);
                hasChanges = true;
            }
        }
        
        // Migrate CCCD mặt sau
        if (organizer.getIdCardBackUrl() != null && 
            organizer.getIdCardBackUrl().startsWith("http")) {
            String publicId = extractPublicIdFromUrl(organizer.getIdCardBackUrl());
            if (publicId != null) {
                organizer.setIdCardBackUrl(publicId);
                hasChanges = true;
            }
        }
        
        // Migrate giấy phép kinh doanh
        if (organizer.getBusinessLicenseUrl() != null && 
            organizer.getBusinessLicenseUrl().startsWith("http")) {
            String publicId = extractPublicIdFromUrl(organizer.getBusinessLicenseUrl());
            if (publicId != null) {
                organizer.setBusinessLicenseUrl(publicId);
                hasChanges = true;
            }
        }
        
        // Migrate logo
        if (organizer.getOrgLogoUrl() != null && 
            organizer.getOrgLogoUrl().startsWith("http")) {
            String publicId = extractPublicIdFromUrl(organizer.getOrgLogoUrl());
            if (publicId != null) {
                organizer.setOrgLogoUrl(publicId);
                hasChanges = true;
            }
        }
        
        // Lưu thay đổi nếu có
        if (hasChanges) {
            organizerRepository.save(organizer);
        }
        
        return hasChanges;
    }
    
    /**
     * Extract public_id từ Cloudinary URL hoặc version path
     */
    private String extractPublicIdFromUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return null;
        }
        
        // Thử extract từ Cloudinary URL
        Matcher cloudinaryMatcher = CLOUDINARY_URL_PATTERN.matcher(url);
        if (cloudinaryMatcher.find()) {
            return cloudinaryMatcher.group(1);
        }
        
        // Thử extract từ version path format: v{version}/{path}
        Matcher versionMatcher = VERSION_PATH_PATTERN.matcher(url);
        if (versionMatcher.find()) {
            return versionMatcher.group(1);
        }
        
        return null;
    }
    
    /**
     * Kiểm tra xem document đã được migrate chưa
     */
    public boolean isDocumentMigrated(String documentUrl) {
        if (documentUrl == null || documentUrl.trim().isEmpty()) {
            return true; // Không có document
        }
        
        // Nếu không phải URL (không bắt đầu bằng http), coi như đã migrate
        return !documentUrl.startsWith("http");
    }
} 