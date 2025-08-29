package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Organizer;
import com.example.backend.model.User;
import com.example.backend.repository.OrganizerRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecureDocumentService {
    
    private final Cloudinary cloudinary;
    private final OrganizerRepository organizerRepository;
    private final UserRepository userRepository;
    
    /**
     * Tạo URL bảo mật để truy cập CCCD
     * @param organizerId ID của organizer
     * @param documentType Loại tài liệu: "front", "back", "license"
     * @return URL bảo mật với kiểm soát quyền truy cập
     */
    public String getSecureDocumentUrl(Integer organizerId, String documentType) {
        log.info("🔍 Getting secure document URL for organizer: {}, type: {}", organizerId, documentType);
        
        // 1. Lấy organizer
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));
        
        // 2. Kiểm tra quyền truy cập
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        boolean isAdmin = currentUser.getTblUserRoles().stream()
                .anyMatch(userRole -> "ADMIN".equals(userRole.getRole().getRoleName()));
        boolean isOwner = organizer.getUser().getId().equals(currentUser.getId());
        
        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Access denied");
        }
        
        // 3. Lấy public_id dựa trên loại tài liệu
        String publicId = switch (documentType.toLowerCase()) {
            case "front" -> organizer.getIdCardFrontUrl();
            case "back" -> organizer.getIdCardBackUrl();
            case "license" -> organizer.getBusinessLicenseUrl();
            default -> throw new RuntimeException("Invalid document type");
        };
        
        log.info("📄 Public ID for {}: {}", documentType, publicId);
        
        if (publicId == null || publicId.trim().isEmpty()) {
            throw new ResourceNotFoundException("Document not found");
        }
        
        // 4. Tạo URL bảo mật
        try {
            String url = cloudinary.url()
                    .resourceType("image")
                    .secure(true)
                    .generate(publicId);
            
            log.info("✅ Generated URL for {}: {}", documentType, url);
            return url;
        } catch (Exception e) {
            log.error("❌ Failed to generate URL for {}: {}", documentType, e.getMessage(), e);
            throw new RuntimeException("Failed to generate secure URL", e);
        }
    }
} 