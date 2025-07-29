package com.example.backend.controller;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.*;
import com.example.backend.service.OrganizerService;
import com.example.backend.util.StatusOrganizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrganizerController {
    private final OrganizerService organizerService;
    @PostMapping("/organizers")
    public ResponseData<?> addOrganizer(@Valid @ModelAttribute OrganizerRequest organizer) {
        try {
            log.info("Bắt đầu tạo organizer cho user: {}", organizer.getName());
            
            // Kiểm tra thêm các file có nội dung không
            if (organizer.getIdCardFront().isEmpty()) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "CCCD mặt trước không được để trống");
            }
            if (organizer.getIdCardBack().isEmpty()) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "CCCD mặt sau không được để trống");
            }
            if (organizer.getBusinessLicense().isEmpty()) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Giấy phép kinh doanh không được để trống");
            }
            if (organizer.getLogo().isEmpty()) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Logo tổ chức không được để trống");
            }
            
            // Kiểm tra website URL nếu có
            if (organizer.getWebsite() != null && !organizer.getWebsite().trim().isEmpty()) {
                String websitePattern = "^(https?://)?[\\w.-]+(?:\\.[\\w.-]+)+[/#?]?.*$";
                if (!organizer.getWebsite().matches(websitePattern)) {
                    return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "URL website không hợp lệ");
                }
            }
            
            // Kiểm tra kích thước file (tối đa 5MB)
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (organizer.getIdCardFront().getSize() > maxSize) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "CCCD mặt trước quá lớn (tối đa 5MB)");
            }
            if (organizer.getIdCardBack().getSize() > maxSize) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "CCCD mặt sau quá lớn (tối đa 5MB)");
            }
            if (organizer.getBusinessLicense().getSize() > maxSize) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Giấy phép kinh doanh quá lớn (tối đa 5MB)");
            }
            if (organizer.getLogo().getSize() > maxSize) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Logo tổ chức quá lớn (tối đa 5MB)");
            }
            
            // Kiểm tra loại file (chỉ cho phép ảnh và PDF)
            String[] allowedTypes = {"image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"};
            if (!isValidFileType(organizer.getIdCardFront().getContentType(), allowedTypes)) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "CCCD mặt trước phải là ảnh hoặc PDF");
            }
            if (!isValidFileType(organizer.getIdCardBack().getContentType(), allowedTypes)) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "CCCD mặt sau phải là ảnh hoặc PDF");
            }
            if (!isValidFileType(organizer.getBusinessLicense().getContentType(), allowedTypes)) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Giấy phép kinh doanh phải là ảnh hoặc PDF");
            }
            if (!isValidFileType(organizer.getLogo().getContentType(), allowedTypes)) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Logo tổ chức phải là ảnh");
            }
            
            organizerService.createOrganizer(organizer);
            log.info("Tạo organizer thành công cho: {}", organizer.getName());
            return new ResponseData<>(HttpStatus.CREATED.value(), "Organizer added successfully");
        } catch (Exception e) {
            log.error("Lỗi khi tạo organizer: {}", e.getMessage(), e);
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi khi tạo organizer: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/{userId}")
    public ResponseData<OrganizerResponse> getOrganizerByUserId(@PathVariable int userId) {
        OrganizerResponse response = organizerService.getOrganizerByUserId(userId);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy thông tin nhà tổ chức thành công", response);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/organizers/{orgId}")
    public ResponseData<OrganizerDetailResponse> getOrganizerDetail(@PathVariable int orgId) {
        log.info("🔍 Admin request organizer detail for ID: {}", orgId);
        try {
            OrganizerDetailResponse response = organizerService.getOrganizerDetail(orgId);
            log.info("🔍 Successfully retrieved organizer: {} (ID: {})", response.getOrgName(), response.getId());
            
            ResponseData<OrganizerDetailResponse> result = new ResponseData<>(HttpStatus.OK.value(), "Get organizer detail successfully", response);
            log.info("🔍 Returning ResponseData: code={}, message={}, hasData={}", 
                    result.getCode(), result.getMessage(), result.getData() != null);
            
            return result;
        } catch (Exception e) {
            log.error("🔍 Error getting organizer detail for ID {}: {}", orgId, e.getMessage(), e);
            throw e;
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/organizers")
    public ResponseData<PageResponse<OrganizerSummaryDTO>> searchOrganizers(Pageable pageable,@RequestParam(name = "search", required = false) String... search) {
        return new ResponseData<>(HttpStatus.OK.value(), "Search organizer successfully", organizerService.searchOrganizers(pageable, search));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/organizers/{orgId}")
    public ResponseData<?> updateOrganizer(@PathVariable int orgId, @RequestParam(name = "status") String status){
        organizerService.updateOrg(orgId,status);
        return new ResponseData<>(HttpStatus.OK.value(), "Update status successfully");
    }
    @GetMapping("/organizers/types")
    public ResponseData<?> getOrgType() {
        return new ResponseData<>(HttpStatus.OK.value(), "Search organizer successfully", organizerService.findAllOrgType());
    }

    @GetMapping("/organizers/status")
    public ResponseData<?> getOrgStatus(){
        StatusOrganizer status = organizerService.getOrganizerStatus();
        return new ResponseData<>(HttpStatus.OK.value(), "Search organizer successfully", status);
    }

    /**
     * Test endpoint để kiểm tra authentication và authorization
     */
    @GetMapping("/organizers/test-auth")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<String> testAuth() {
        log.info("🔍 Test auth endpoint called successfully");
        return new ResponseData<>(HttpStatus.OK.value(), "Admin authentication successful", "OK");
    }

    /**
     * Test endpoint để kiểm tra database connection và data
     */
    @GetMapping("/organizers/test-db")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<Object> testDatabase() {
        log.info("🔍 Test database endpoint called");
        try {
            // Sử dụng service thay vì repository trực tiếp
            long count = organizerService.getOrganizerCount();
            log.info("🔍 Total organizers in database: {}", count);
            
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("totalOrganizers", count);
            result.put("message", "Database connection successful");
            
            return new ResponseData<>(HttpStatus.OK.value(), "Database test successful", result);
        } catch (Exception e) {
            log.error("🔍 Database test error: {}", e.getMessage(), e);
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Database test failed: " + e.getMessage(), null);
        }
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/events")
    public ResponseData<List<EventSummaryDTO>> getEventsByOrganizer() {
        List<EventSummaryDTO> events = organizerService.getEventsByCurrentOrganizer();
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách sự kiện thành công", events);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/view-buyers")
    public ResponseData<List<BuyerSummaryDTO>> getBuyersForOrganizer() {
        List<BuyerSummaryDTO> buyers = organizerService.getBuyersForCurrentOrganizer();
        return new ResponseData<>(HttpStatus.OK.value(), "Danh sách người mua", buyers);
    }
    
    /**
     * Kiểm tra loại file có hợp lệ không
     */
    private boolean isValidFileType(String contentType, String[] allowedTypes) {
        if (contentType == null) return false;
        for (String allowedType : allowedTypes) {
            if (contentType.equalsIgnoreCase(allowedType)) {
                return true;
            }
        }
        return false;
    }

}
