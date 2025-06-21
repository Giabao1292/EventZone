package com.example.backend.service;

import com.example.backend.dto.request.LayoutRequest;
import com.example.backend.dto.response.LayoutDTO;

public interface LayoutService {
    void saveLayout(LayoutRequest request);
}
