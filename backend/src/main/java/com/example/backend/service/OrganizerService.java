package com.example.backend.service;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.*;
import com.example.backend.model.Organizer;
import com.example.backend.util.StatusOrganizer;
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

    Organizer getOrganizerByEmail(String email);

    StatusOrganizer getOrganizerStatus();

    List<BuyerSummaryDTO> getBuyersForCurrentOrganizer();

    List<EventSummaryDTO> getEventsByCurrentOrganizer();

    long getOrganizerCount();

}
