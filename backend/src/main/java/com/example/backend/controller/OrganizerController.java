package com.example.backend.controller;

import com.example.backend.dto.request.OrganizerRequest;
import com.example.backend.dto.response.OrganizerResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.Organizer;
import com.example.backend.service.OrganizerService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
@RestController
@Slf4j
@RequestMapping("/api/")
@RequiredArgsConstructor
public class OrganizerController {
    private final OrganizerService organizerService;
    @PostMapping("/organizers")
    public ResponseData<?> addOrganizer(@ModelAttribute OrganizerRequest organizer) {
        organizerService.createOrganizer(organizer);
        return new ResponseData(HttpStatus.CREATED.value(), "Organizer added successfully");
    }
    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/{userId}")
    public ResponseData<OrganizerResponse> getOrganizerByUserId(@PathVariable int userId) {
        OrganizerResponse response = organizerService.getOrganizerByUserId(userId);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy thông tin nhà tổ chức thành công", response);
    }
}
