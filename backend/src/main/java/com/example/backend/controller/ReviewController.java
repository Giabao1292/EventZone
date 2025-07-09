package com.example.backend.controller;

import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<ResponseData<ReviewResponse>> createReview(
            @RequestBody ReviewRequest dto,
            @RequestParam Integer currentUserId
    ) {
        ReviewResponse review = reviewService.createReview(dto, currentUserId);
        return ResponseEntity.ok(new ResponseData<>(200, "Tạo review thành công", review));
    }

    @PreAuthorize("hasAnyRole('USER','ORGANIZER','ADMIN')")
    @PutMapping("/{reviewId}")
    public ResponseEntity<ResponseData<ReviewResponse>> updateReview(
            @PathVariable Integer reviewId,
            @RequestBody ReviewRequest dto,
            @RequestParam Integer currentUserId
    ) {
        ReviewResponse review = reviewService.updateReview(reviewId, dto, currentUserId);
        return ResponseEntity.ok(new ResponseData<>(200, "Cập nhật review thành công", review));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ResponseData<Void>> deleteReview(
            @PathVariable Integer reviewId,
            @RequestParam Integer currentUserId
    ) {
        reviewService.deleteReview(reviewId, currentUserId);
        return ResponseEntity.ok(new ResponseData<>(200, "Xóa review thành công"));
    }


    // API cũ - giữ nguyên để không ảnh hưởng FE cũ (nếu có)
    @GetMapping("/showing-time/{showingTimeId}")
    public ResponseEntity<ResponseData<List<ReviewResponse>>> getReviewsByShowingTime(
            @PathVariable Integer showingTimeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<ReviewResponse> reviews = reviewService.getReviewsByShowingTime(showingTimeId, page, size);
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách review thành công", reviews));
    }

    // Thêm API mới cho FE gọi kiểu query
    @GetMapping
    public ResponseEntity<ResponseData<List<ReviewResponse>>> getReviewsByShowingTimeQuery(
            @RequestParam("showingTimeId") Integer showingTimeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "active") String status // <-- thêm param
    ) {
        List<ReviewResponse> reviews;
        if ("all".equals(status)) {
            // trả về cả active và deleted
            reviews = reviewService.getAllReviewsByShowingTime(showingTimeId, page, size);
        } else {
            // như cũ, chỉ active
            reviews = reviewService.getReviewsByShowingTime(showingTimeId, page, size);
        }
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách review thành công", reviews));
    }



    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/showing-time/{showingTimeId}")
    public ResponseEntity<ResponseData<List<ReviewResponse>>> getReviewsByShowingTimeForAdmin(
            @PathVariable Integer showingTimeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "active") String status
    ) {
        List<ReviewResponse> reviews = reviewService.getReviewsByShowingTimeForAdmin(showingTimeId, page, size, status);
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách review cho admin thành công", reviews));
    }



    @GetMapping("/has-reviewed")
    public ResponseEntity<ResponseData<Boolean>> hasUserReviewed(
            @RequestParam("showingTimeId") Integer showingTimeId,
            @RequestParam("currentUserId") Integer currentUserId
    ) {
        boolean hasReviewed = reviewService.hasUserReviewed(showingTimeId, currentUserId);
        return ResponseEntity.ok(new ResponseData<>(200, "Kiểm tra thành công", hasReviewed));
    }


}
