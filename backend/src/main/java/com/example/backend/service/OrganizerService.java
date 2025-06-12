package com.example.backend.service;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.OrganizerResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface OrganizerService {
    String uploadPics(MultipartFile file) throws IOException;
    void createOrganizer(OrganizerRequest request);
    OrganizerResponse getOrganizerByUserId(int userId);
}
