package com.example.backend.controller;

import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.ShowingTime;
import com.example.backend.service.ShowingTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events/showing-times")
@RequiredArgsConstructor
public class ShowingTimeController {

    private  final ShowingTimeService showingTimeService;

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/create")
    public ResponseData<List<ShowingTime>> createMultiple(@RequestBody CreateMultipleShowingTimeRequest req) {
        List<ShowingTime> created = showingTimeService.createMultipleShowingTimes(req);
        return new ResponseData(HttpStatus.CREATED.value(), "showing time added successfully", created);
    }
}
