package com.example.backend.controller;

import com.example.backend.dto.request.ReviewReplyRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.ReviewReplyResponse;
import com.example.backend.service.ReviewReplyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-replies")
public class ReviewReplyController {

    private final ReviewReplyService reviewReplyService;

    public ReviewReplyController(ReviewReplyService reviewReplyService) {
        this.reviewReplyService = reviewReplyService;
    }


    @GetMapping("/review/{reviewId}")
    public ResponseEntity<ResponseData<List<ReviewReplyResponse>>> getRepliesByReview(
            @PathVariable Integer reviewId) {
        List<ReviewReplyResponse> replies = reviewReplyService.getRepliesByReviewId(reviewId);
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách trả lời thành công", replies));
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ResponseData<ReviewReplyResponse>> createReply(
            @RequestBody ReviewReplyRequest request) {
        String organizerEmail = getCurrentUserEmail();
        reviewReplyService.checkOrganizerCanReply(request.getReviewId(), organizerEmail);

        ReviewReplyResponse saved = reviewReplyService.createReply(request, organizerEmail);
        return ResponseEntity.ok(new ResponseData<>(200, "Tạo trả lời thành công", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ResponseData<ReviewReplyResponse>> updateReply(
            @PathVariable Integer id,
            @RequestBody ReviewReplyRequest request) {
        String organizerEmail = getCurrentUserEmail();
        reviewReplyService.checkOrganizerCanUpdateOrDeleteReply(id, organizerEmail);

        ReviewReplyResponse updated = reviewReplyService.updateReply(id, request, organizerEmail);
        return ResponseEntity.ok(new ResponseData<>(200, "Cập nhật trả lời thành công", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ResponseData<Void>> deleteReply(@PathVariable Integer id) {
        String organizerEmail = getCurrentUserEmail();
        reviewReplyService.checkOrganizerCanUpdateOrDeleteReply(id, organizerEmail);

        reviewReplyService.deleteReply(id, organizerEmail);
        return ResponseEntity.ok(new ResponseData<>(200, "Xóa trả lời thành công"));
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}


