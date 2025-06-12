package com.example.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.OrganizerResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Organizer;
import com.example.backend.model.User;
import com.example.backend.repository.OrganizerRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.OrganizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrganizerServiceImpl implements OrganizerService {
    private final Cloudinary cloudinary;
    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;

    @Override
    public String uploadPics(MultipartFile file){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            File tempFile = File.createTempFile("id-doc-", file.getOriginalFilename());
            file.transferTo(tempFile);

            // Upload lên Cloudinary (có thể để vào folder riêng: "identity_docs")
            Map uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.asMap(
                    "folder", "identity_docs",
                    "public_id", "in4_organizer_" + user.getId(),
                    "overwrite", true,
                    "resource_type", "auto" // Cho phép ảnh hoặc PDF
            ));
            String documentUrl = (String) uploadResult.get("secure_url");
            return documentUrl;
        }
        catch (IOException e) {
            throw new ResourceNotFoundException("Could not upload file");
        }
    }

    @Override
    public void createOrganizer(OrganizerRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String idCardFrontUrl = uploadPics(request.getIdCardFront()) ;
        String idCardBackUrl = uploadPics(request.getIdCardBack()) ;
        String logoUrl = uploadPics(request.getLogo());
        String businessUrl = uploadPics(request.getBusinessLicense());
        Organizer organizer = Organizer.builder()
                .user(user)
                .orgName(request.getName())
                .orgType(request.getOrganizationType())
                .taxCode(request.getTaxCode())
                .orgAddress(request.getAddress())
                .website(request.getWebsite())
                .businessField(request.getBusinessSector())
                .orgInfo(request.getDescription())
                .idCardFrontUrl(idCardFrontUrl)
                .idCardBackUrl(idCardBackUrl)
                .orgLogoUrl(logoUrl)
                .businessLicenseUrl(businessUrl)
                .build();
        organizerRepository.save(organizer);
    }
    public OrganizerResponse getOrganizerByUserId(int userId) {
        try {
            // 1. Tìm Organizer theo userId
            Optional<Organizer> organizerOpt = organizerRepository.findByUserId(userId);

            if (organizerOpt.isEmpty()) {
                throw new ResourceNotFoundException("Không tìm thấy thông tin nhà tổ chức");
            }

            Organizer organizer = organizerOpt.get();

            // 2. Mapping thủ công từ entity sang DTO
            OrganizerResponse response = new OrganizerResponse();
            response.setId(organizer.getId());

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi hệ thống: " + e.getMessage(), e);
        }
    }
}
