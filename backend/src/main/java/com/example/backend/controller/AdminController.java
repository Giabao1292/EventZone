package com.example.backend.controller;

import com.example.backend.dto.response.ResponseData;
import com.example.backend.util.DocumentMigrationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final DocumentMigrationUtil documentMigrationUtil;
    
    /**
     * Endpoint để migrate documents từ URL sang public_id
     * Chỉ admin mới có quyền chạy
     */
    @PostMapping("/migrate-documents")
    public ResponseData<String> migrateDocuments() {
        try {
            documentMigrationUtil.migrateAllOrganizerDocuments();
            return new ResponseData<>(HttpStatus.OK.value(), "Migration completed successfully", null);
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), 
                "Migration failed: " + e.getMessage(), null);
        }
    }
} 