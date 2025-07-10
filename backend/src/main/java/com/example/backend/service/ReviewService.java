package com.example.backend.service;

import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(ReviewRequest dto, Integer currentUserId);

    ReviewResponse updateReview(Integer reviewId, ReviewRequest dto, Integer currentUserId);

    void deleteReview(Integer reviewId, Integer currentUserId);

    List<ReviewResponse> getReviewsByShowingTime(Integer showingTimeId);

    List<ReviewResponse> getReviewsByShowingTime(Integer showingTimeId, int page, int size);

    List<ReviewResponse> getAllReviewsByShowingTime(Integer showingTimeId, int page, int size); // THÊM DÒNG NÀY

    List<ReviewResponse> getReviewsByShowingTimeForAdmin(Integer showingTimeId, int page, int size, String status);

    List<Integer> getShowingTimeIdsByUserId(Integer userId);

    boolean hasUserReviewed(Integer showingTimeId, Integer currentUserId);

}
