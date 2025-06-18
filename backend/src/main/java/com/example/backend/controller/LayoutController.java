package com.example.backend.controller;

import com.example.backend.dto.request.LayoutRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.LayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class LayoutController {

    private final LayoutService layoutService;

    /**
     * Legacy endpoint giữ nguyên để frontend cũ không phải đổi
     */
    @PostMapping("/api/events/save-layout")
    public ResponseData<?> saveLayout(@RequestBody LayoutRequest request) {
        // Nếu request thiếu showingTimeId, trả về lỗi rõ ràng
        if (request.getShowingTimeId() == null) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "showingTimeId là bắt buộc");
        }
        layoutService.saveLayout(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Layout đã được lưu thành công");
    }


}
