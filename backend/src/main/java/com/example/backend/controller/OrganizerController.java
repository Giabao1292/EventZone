package com.example.backend.controller;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.*;
import com.example.backend.model.Organizer;
import com.example.backend.service.OrganizerService;
import com.example.backend.util.StatusOrganizer;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrganizerController {
    private final OrganizerService organizerService;
    @PostMapping("/organizers")
    public ResponseData<?> addOrganizer(@ModelAttribute OrganizerRequest organizer) {
        organizerService.createOrganizer(organizer);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Organizer added successfully");
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
        return new ResponseData<>(HttpStatus.OK.value(), "Get organizer detail successfully", organizerService.getOrganizerDetail(orgId));
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

}
