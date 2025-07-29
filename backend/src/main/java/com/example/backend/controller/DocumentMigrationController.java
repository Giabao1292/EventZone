package com.example.backend.controller;

import com.example.backend.dto.response.ResponseData;
import com.example.backend.util.DocumentMigrationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller để chạy migration documents
 * CHỈ DÀNH CHO ADMIN - CẨN THẬN KHI SỬ DỤNG
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/migration")
@PreAuthorize("hasRole('ADMIN')")
public class DocumentMigrationController {
    
    private final DocumentMigrationUtil documentMigrationUtil;
    
    /**
     * Migrate tất cả organizer documents từ URL sang public_id
     * CHỈ CHẠY MỘT LẦN KHI CẦN THIẾT
     */
    @PostMapping("/documents")
    public ResponseData<String> migrateAllDocuments() {
        try {
            log.warn("ADMIN đang chạy migration documents - Đây là thao tác quan trọng!");
            
            documentMigrationUtil.migrateAllOrganizerDocuments();
            
            return new ResponseData<>(
                HttpStatus.OK.value(), 
                "Migration documents thành công", 
                "Tất cả documents đã được migrate từ URL sang public_id"
            );
        } catch (Exception e) {
            log.error("Lỗi khi chạy migration documents: {}", e.getMessage(), e);
            return new ResponseData<>(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Lỗi khi chạy migration",
                e.getMessage()
            );
        }
    }
} 