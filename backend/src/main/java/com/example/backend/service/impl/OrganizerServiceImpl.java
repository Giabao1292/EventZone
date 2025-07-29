package com.example.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.NotificationService;
import com.example.backend.service.OrganizerService;
import com.example.backend.util.StatusOrganizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import static com.example.backend.util.StatusOrganizer.APPROVED;
import static com.example.backend.util.StatusOrganizer.PENDING;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizerServiceImpl implements OrganizerService {
    private final Cloudinary cloudinary;
    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;
    private final SearchCriteriaRepository searchCriteriaRepository;
    private final OrgTypeRepository orgTypeRepository;
    private final RoleRepository roleRepository;
    private final NotificationService notificationService;
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;


    @Override
    public String uploadPics(MultipartFile file) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            File tempFile = File.createTempFile("id-doc-", file.getOriginalFilename());
            file.transferTo(tempFile);

            // Upload lên Cloudinary với public_id duy nhất
            String uniqueId = "organizer_" + user.getId() + "_" + System.currentTimeMillis();
            Map uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.asMap(
                    "folder", "identity_docs",
                    "public_id", uniqueId,
                    "overwrite", true,
                    "resource_type", "image" // Chỉ cho phép ảnh
            ));
            
            // Trả về public_id thay vì URL để bảo mật
            String publicId = (String) uploadResult.get("public_id");
            return publicId;
        } catch (IOException e) {
            throw new ResourceNotFoundException("Could not upload file");
        }
    }

    @Override
    public void createOrganizer(OrganizerRequest request) {
        try {
            log.info("Bắt đầu tạo organizer cho request: {}", request.getName());
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            log.info("Username: {}", username);
            
            User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            log.info("Tìm thấy user: {}", user.getEmail());
            
            // Kiểm tra xem user đã có organizer chưa
            Optional<Organizer> existingOrganizer = organizerRepository.findByUserId(user.getId());
            if (existingOrganizer.isPresent()) {
                Organizer organizer = existingOrganizer.get();
                log.info("User đã có organizer với status: {}", organizer.getStatus());
                
                // Nếu đã bị từ chối, cho phép cập nhật thông tin và gửi lại
                if (organizer.getStatus() == StatusOrganizer.REJECTED) {
                    log.info("Cập nhật organizer bị từ chối...");
                    
                    // Xóa các file cũ trên Cloudinary nếu có
                    if (organizer.getIdCardFrontUrl() != null) {
                        try {
                            cloudinary.uploader().destroy(organizer.getIdCardFrontUrl(), ObjectUtils.emptyMap());
                        } catch (Exception e) {
                            log.warn("Không thể xóa file CCCD mặt trước cũ: {}", e.getMessage());
                        }
                    }
                    if (organizer.getIdCardBackUrl() != null) {
                        try {
                            cloudinary.uploader().destroy(organizer.getIdCardBackUrl(), ObjectUtils.emptyMap());
                        } catch (Exception e) {
                            log.warn("Không thể xóa file CCCD mặt sau cũ: {}", e.getMessage());
                        }
                    }
                    if (organizer.getBusinessLicenseUrl() != null) {
                        try {
                            cloudinary.uploader().destroy(organizer.getBusinessLicenseUrl(), ObjectUtils.emptyMap());
                        } catch (Exception e) {
                            log.warn("Không thể xóa file giấy phép cũ: {}", e.getMessage());
                        }
                    }
                    if (organizer.getOrgLogoUrl() != null) {
                        try {
                            cloudinary.uploader().destroy(organizer.getOrgLogoUrl(), ObjectUtils.emptyMap());
                        } catch (Exception e) {
                            log.warn("Không thể xóa file logo cũ: {}", e.getMessage());
                        }
                    }
                    
                    // Upload files mới
                    log.info("Bắt đầu upload files mới...");
                    String idCardFrontUrl = uploadPics(request.getIdCardFront());
                    String idCardBackUrl = uploadPics(request.getIdCardBack());
                    String logoUrl = uploadPics(request.getLogo());
                    String businessUrl = uploadPics(request.getBusinessLicense());
                    
                    // Cập nhật thông tin
                    OrgType orgType = orgTypeRepository.findByTypeCode(request.getOrgTypeCode())
                            .orElseThrow(() -> new ResourceNotFoundException("OrgType not found"));
                    
                    organizer.setOrgName(request.getName());
                    organizer.setOrgType(orgType);
                    organizer.setTaxCode(request.getTaxCode());
                    organizer.setOrgAddress(request.getAddress());
                    organizer.setWebsite(request.getWebsite());
                    organizer.setBusinessField(request.getBusinessSector());
                    organizer.setOrgInfo(request.getDescription());
                    organizer.setIdCardFrontUrl(idCardFrontUrl);
                    organizer.setIdCardBackUrl(idCardBackUrl);
                    organizer.setOrgLogoUrl(logoUrl);
                    organizer.setBusinessLicenseUrl(businessUrl);
                    organizer.setStatus(PENDING);
                    organizer.setUpdatedAt(Instant.now());
                    
                    Organizer updatedOrganizer = organizerRepository.save(organizer);
                    log.info("Cập nhật organizer thành công với ID: {}", updatedOrganizer.getId());
                    
                    notificationService.notifyOrganizerRegistration(user);
                    log.info("Cập nhật organizer hoàn tất thành công!");
                    return;
                } else {
                    // Nếu đã có organizer với status khác REJECTED, không cho phép tạo mới
                    throw new RuntimeException("Bạn đã có đơn đăng ký với trạng thái: " + organizer.getStatus());
                }
            }
            
            // Tạo organizer mới nếu chưa có
            log.info("Tạo organizer mới...");
            log.info("Bắt đầu upload files...");
            String idCardFrontUrl = uploadPics(request.getIdCardFront());
            log.info("Upload CCCD mặt trước thành công: {}", idCardFrontUrl);
            
            String idCardBackUrl = uploadPics(request.getIdCardBack());
            log.info("Upload CCCD mặt sau thành công: {}", idCardBackUrl);
            
            String logoUrl = uploadPics(request.getLogo());
            log.info("Upload logo thành công: {}", logoUrl);
            
            String businessUrl = uploadPics(request.getBusinessLicense());
            log.info("Upload giấy phép kinh doanh thành công: {}", businessUrl);
            
            OrgType orgType = orgTypeRepository.findByTypeCode(request.getOrgTypeCode())
                    .orElseThrow(() -> new ResourceNotFoundException("OrgType not found"));
            log.info("Tìm thấy orgType: {}", orgType.getTypeName());
            
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
            
            log.info("Tạo organizer object thành công, bắt đầu lưu vào database...");
            Organizer savedOrganizer = organizerRepository.save(organizer);
            log.info("Lưu organizer thành công với ID: {}", savedOrganizer.getId());
            
            log.info("Gửi notification...");
            notificationService.notifyOrganizerRegistration(user);
            log.info("Tạo organizer hoàn tất thành công!");
            
        } catch (Exception e) {
            log.error("Lỗi khi tạo organizer: {}", e.getMessage(), e);
            throw e;
        }
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
            response.setOrgName(organizer.getOrgName());
            response.setTaxCode(organizer.getTaxCode());
            response.setOrgAddress(organizer.getOrgAddress());
            response.setWebsite(organizer.getWebsite());
            response.setBusinessField(organizer.getBusinessField());
            response.setOrgInfo(organizer.getOrgInfo());
            response.setOrgLogoUrl(organizer.getOrgLogoUrl());
            response.setIdCardFrontUrl(organizer.getIdCardFrontUrl());
            response.setIdCardBackUrl(organizer.getIdCardBackUrl());
            response.setBusinessLicenseUrl(organizer.getBusinessLicenseUrl());
            response.setExperience(organizer.getExperience());

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
    private Page<Organizer> findAllOrganizer(Pageable pageable) {
        try {
            log.info("Bắt đầu tìm tất cả organizers với pageable: {}", pageable);
            Page<Integer> organizerIds = organizerRepository.findAllOrganizerId(pageable);
            log.info("Tìm thấy {} organizer IDs", organizerIds.getTotalElements());
            
            List<Organizer> organizers = organizerRepository.findALlOrganizersByIds(organizerIds.getContent());
            log.info("Lấy được {} organizers từ database", organizers.size());
            
            return new PageImpl<>(organizers, pageable, organizerIds.getTotalElements());
        } catch (Exception e) {
            log.error("Lỗi khi tìm tất cả organizers: {}", e.getMessage(), e);
            throw e;
        }
    }
    @Override
    public PageResponse<OrganizerSummaryDTO> searchOrganizers(Pageable pageable, String... search) {
        try {
            log.info("Bắt đầu search organizers với pageable: {} và search: {}", pageable, search);
            
            Page<Organizer> organizerPage = (search != null && search.length != 0) ? 
                searchCriteriaRepository.searchOrganizers(pageable, search) : 
                findAllOrganizer(pageable);
            
            log.info("Tìm thấy {} organizers", organizerPage.getTotalElements());
            
            List<OrganizerSummaryDTO> organizerResponses = toOrganizerSummaryDTO(organizerPage.getContent());
            log.info("Convert thành {} DTOs", organizerResponses.size());
            
            PageResponse<OrganizerSummaryDTO> response = PageResponse.<OrganizerSummaryDTO>builder()
                    .totalElements((int) organizerPage.getTotalElements())
                    .size(organizerPage.getSize())
                    .number(organizerPage.getNumber())
                    .totalPages(organizerPage.getTotalPages())
                    .content(organizerResponses)
                    .build();
            
            log.info("Trả về response với {} organizers", response.getContent().size());
            return response;
            
        } catch (Exception e) {
            log.error("Lỗi khi search organizers: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public OrganizerDetailResponse getOrganizerDetail(int id) {
        log.info("Getting organizer detail for ID: {}", id);
        
        try {
            log.info("🔍 Searching for organizer with ID: {}", id);
            // Try using default findById first
            Optional<Organizer> organizerOpt = organizerRepository.findById(id);
            
            if (organizerOpt.isEmpty()) {
                log.error("🔍 Organizer not found with ID: {}", id);
                throw new ResourceNotFoundException("Organizer not found with ID: " + id);
            }
            
            Organizer organizer = organizerOpt.get();
            log.info("Found organizer: {} (ID: {})", organizer.getOrgName(), organizer.getId());
            
            // Load user separately if needed
            if (organizer.getUser() == null) {
                log.info("🔍 User is null, loading user separately");
            }
            
            // Tạo user response riêng để tránh circular reference
            User user = organizer.getUser();
            User userResponse = null;
            if (user != null) {
                userResponse = User.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .profileUrl(user.getProfileUrl())
                    .phone(user.getPhone())
                    .dateOfBirth(user.getDateOfBirth())
                    .status(user.getStatus())
                    .score(user.getScore())
                    .createAt(user.getCreateAt())
                    .updateAt(user.getUpdateAt())
                    .build();
                
                // Set empty collections thay vì null để tránh NPE
                userResponse.setTblBookings(new LinkedHashSet<>());
                userResponse.setTblReviews(new LinkedHashSet<>());
                userResponse.setTblUserRoles(new LinkedHashSet<>());
                userResponse.setTblUserVouchers(new LinkedHashSet<>());
                userResponse.setTblNotifications(new LinkedHashSet<>());
                userResponse.setTblEvents(new LinkedHashSet<>());
                userResponse.setWishlist(new LinkedHashSet<>());
                userResponse.setTrackingEvents(new LinkedHashSet<>());
                userResponse.setOrganizer(null);
            }
            
            OrganizerDetailResponse response = OrganizerDetailResponse.builder()
                    .id(organizer.getId())
                    .orgName(organizer.getOrgName())
                    .orgInfo(organizer.getOrgInfo())
                    .website(organizer.getWebsite())
                    .experience(organizer.getExperience())
                    .businessField(organizer.getBusinessField())
                    .businessLicenseUrl(organizer.getBusinessLicenseUrl())
                    .idCardBackUrl(organizer.getIdCardBackUrl())
                    .idCardFrontUrl(organizer.getIdCardFrontUrl())
                    .orgLogoUrl(organizer.getOrgLogoUrl())
                    .taxCode(organizer.getTaxCode())
                    .orgAddress(organizer.getOrgAddress())
                    .status(organizer.getStatus())
                    .createdAt(organizer.getCreatedAt())
                    .user(userResponse)
                    .build();
            
            log.info("Built response for organizer: {}", response.getOrgName());
            return response;
            
        } catch (Exception e) {
            log.error("Error getting organizer detail for ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
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
            notificationService.notifyRoleApproved(organizer.getUser());
            userRepository.save(organizer.getUser());
        }
        else{
            notificationService.notifyRoleRejected(organizer.getUser());
        }
        organizer.setStatus(StatusOrganizer.valueOf(status));
        organizerRepository.save(organizer);
    }

    @Override
    public Organizer getOrganizerByEmail(String email) {
        return organizerRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy organizer cho username: " + email));
    }

    @Override
    public StatusOrganizer getOrganizerStatus(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username).get();
        return user.getOrganizer().getStatus();
    }

    @Override
    public List<BuyerSummaryDTO> getBuyersForCurrentOrganizer() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Organizer organizer = user.getOrganizer();
        return bookingRepository.findBuyersByOrganizerId(organizer.getId());
    }

    @Override
    public List<EventSummaryDTO> getEventsByCurrentOrganizer() {
        Organizer organizer = getCurrentOrganizer(); // dùng helper
        List<Event> events = eventRepository.findByOrganizer_Id(organizer.getId());
        return events.stream()
                .map(EventSummaryDTO::new)
                .toList();
    }

    private Organizer getCurrentOrganizer() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getOrganizer();
    }

    @Override
    public long getOrganizerCount() {
        return organizerRepository.count();
    }

}
