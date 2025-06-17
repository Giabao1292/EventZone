package com.example.backend.service;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface OrganizerService {
    String uploadPics(MultipartFile file) throws IOException;
    void createOrganizer(OrganizerRequest request);
    OrganizerResponse getOrganizerByUserId(int userId);


    PageResponse<OrganizerSummaryDTO> searchOrganizers(Pageable pageable, String... search);

    OrganizerDetailResponse getOrganizerDetail(int id);

    List<OrgTypeResponse> findAllOrgType();

    void updateOrg(int id, String status);
}
