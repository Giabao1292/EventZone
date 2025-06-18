package com.example.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.OrgType;
import com.example.backend.model.Organizer;
import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import com.example.backend.repository.*;
import com.example.backend.service.OrganizerService;
import com.example.backend.service.UserService;
import com.example.backend.util.StatusOrganizer;
import jdk.jshell.Snippet;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.example.backend.util.StatusOrganizer.*;

@Service
@RequiredArgsConstructor
public class OrganizerServiceImpl implements OrganizerService {
    private final Cloudinary cloudinary;
    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;
    private final SearchCriteriaRepository searchCriteriaRepository;
    private final OrgTypeRepository orgTypeRepository;
    private final UserService userService;
    private final RoleRepository roleRepository;

    @Override
    public String uploadPics(MultipartFile file) {
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
        } catch (IOException e) {
            throw new ResourceNotFoundException("Could not upload file");
        }
    }

    @Override
    public void createOrganizer(OrganizerRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String idCardFrontUrl = uploadPics(request.getIdCardFront());
        String idCardBackUrl = uploadPics(request.getIdCardBack());
        String logoUrl = uploadPics(request.getLogo());
        String businessUrl = uploadPics(request.getBusinessLicense());
        OrgType orgType = orgTypeRepository.findByTypeCode(request.getOrgTypeCode()).orElseThrow(() -> new ResourceNotFoundException("OrgType not found"));
        Organizer organizer = Organizer.builder()
                .user(user)
                .orgName(request.getName())
                .orgType(orgType)
                .taxCode(request.getTaxCode())
                .orgAddress(request.getAddress())
                .website(request.getWebsite())
                .businessField(request.getBusinessSector())
                .orgInfo(request.getDescription())
                .idCardFrontUrl(idCardFrontUrl)
                .idCardBackUrl(idCardBackUrl)
                .status(PENDING)
                .createdAt(Instant.now())
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

    public List<OrganizerSummaryDTO> toOrganizerSummaryDTO(List<Organizer> organizerList) {
        return organizerList.stream().map(organizer -> OrganizerSummaryDTO.builder()
                .id(organizer.getId())
                .email(organizer.getUser().getEmail())
                .fullName(organizer.getUser().getFullName())
                .address(organizer.getOrgAddress())
                .createdAt(organizer.getCreatedAt())
                .orgType(organizer.getOrgType().getTypeName())
                .orgName(organizer.getOrgName())
                .status(organizer.getStatus())
                .build()).toList();
    }

    @Override
    public PageResponse<OrganizerSummaryDTO> searchOrganizers(Pageable pageable, String... search) {
        Page<Organizer> organizerPage = (search != null && search.length != 0) ? searchCriteriaRepository.searchOrganizers(pageable, search) : organizerRepository.findAll(pageable);
        List<OrganizerSummaryDTO> organizerResponses = toOrganizerSummaryDTO(organizerPage.getContent());
        return PageResponse.<OrganizerSummaryDTO>builder()
                .totalElements((int) organizerPage.getTotalElements())
                .size(organizerPage.getSize())
                .number(organizerPage.getNumber())
                .totalPages(organizerPage.getTotalPages())
                .content(organizerResponses)
                .build();
    }

    @Override
    public OrganizerDetailResponse getOrganizerDetail(int id) {
        Organizer organizer = organizerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));
        return OrganizerDetailResponse.builder()
                .orgName(organizer.getOrgName())
                .orgInfo(organizer.getOrgInfo())
                .website(organizer.getWebsite())
                .experience(organizer.getExperience())
                .businessField(organizer.getBusinessField())
                .businessLicenseUrl(organizer.getBusinessLicenseUrl())
                .idCardBackUrl(organizer.getIdCardBackUrl())
                .idCardFrontUrl(organizer.getIdCardFrontUrl())
                .orgLogoUrl(organizer.getOrgLogoUrl())
                .build();
    }

    @Override
    public List<OrgTypeResponse> findAllOrgType() {
        return orgTypeRepository.findAll().stream().map(orgType -> OrgTypeResponse
                .builder()
                .typeName(orgType.getTypeName())
                .typeCode(orgType.getTypeCode())
                .build()).toList();
    }
    @Override
    public void updateOrg(int id, String status){
        Organizer organizer = organizerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));
        if(StatusOrganizer.valueOf(status).equals(APPROVED)) {
            UserRole userRole = new UserRole();
            userRole.setUser(organizer.getUser());
            userRole.setRole(roleRepository.findByRoleName("ORGANIZER").orElseThrow(() -> new ResourceNotFoundException("Role not found")));
            organizer.getUser().getTblUserRoles().add(userRole);
            userRepository.save(organizer.getUser());
        }
        organizer.setStatus(StatusOrganizer.valueOf(status));
        organizerRepository.save(organizer);
    }
}
