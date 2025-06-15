package com.example.backend.controller;

import com.example.backend.dto.request.LayoutRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.LayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class LayoutController {

    private final LayoutService layoutService;

    @PostMapping("/save-layout")
    public ResponseData<?> saveLayout(@RequestBody LayoutRequest request) {
        layoutService.saveLayout(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "showing time added successfully");
    }
}