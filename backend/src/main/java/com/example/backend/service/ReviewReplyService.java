package com.example.backend.service;

import com.example.backend.dto.request.ReviewReplyRequest;
import com.example.backend.dto.response.ReviewReplyResponse;
import java.util.List;

public interface ReviewReplyService {
    void checkOrganizerCanReply(Integer reviewId, String organizerEmail);

    void checkOrganizerCanUpdateOrDeleteReply(Integer replyId, String organizerEmail);

    ReviewReplyResponse createReply(ReviewReplyRequest request, String organizerEmail);

    ReviewReplyResponse updateReply(Integer id, ReviewReplyRequest request, String organizerEmail);

    void deleteReply(Integer id, String organizerEmail);

    List<ReviewReplyResponse> getRepliesByReviewId(Integer reviewId);
}
