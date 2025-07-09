
package com.example.backend.service.impl;

import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.model.*;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.ShowingTimeRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {


    private final ReviewRepository reviewRepository;

    private final ShowingTimeRepository showingTimeRepository;

    private final BookingRepository bookingRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest dto, Integer currentUserId) {
        ShowingTime showingTime = showingTimeRepository.findById(dto.getShowingTimeId())
                .orElseThrow(() -> new RuntimeException("Suất chiếu không tồn tại"));

        if (showingTime.getEndTime().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Chỉ được đánh giá sau khi suất chiếu kết thúc");
        }

        boolean hasBooking = bookingRepository.existsByShowingTime_IdAndUser_Id(dto.getShowingTimeId(), currentUserId);
        if (!hasBooking) {
            throw new RuntimeException("Bạn chưa tham gia suất chiếu này!");
        }

        boolean exists = reviewRepository.existsByShowingTime_IdAndUser_IdAndStatus(dto.getShowingTimeId(), currentUserId, ReviewStatus.active);
        if (exists) {
            throw new RuntimeException("Bạn đã đánh giá suất chiếu này rồi!");
        }

        Review review = new Review();
        review.setShowingTime(showingTime);
        review.setUser(new User(currentUserId));
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review.setStatus(ReviewStatus.active);

        reviewRepository.save(review);

        return toResponseDto(review);
    }

    @Override
    public ReviewResponse updateReview(Integer reviewId, ReviewRequest dto, Integer currentUserId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));

        // Nếu chỉ muốn update status (ẩn bình luận, do organizer hoặc admin gọi)
        if (dto.getStatus() != null) {
            // Có thể bổ sung check role ở đây (tùy yêu cầu)
            review.setStatus(ReviewStatus.valueOf(dto.getStatus()));
            review.setUpdatedAt(LocalDateTime.now());
            reviewRepository.save(review);
            return toResponseDto(review);
        }

        // User sửa bình luận của mình (và phải là active)
        if (!review.getUser().getId().equals(currentUserId) || review.getStatus() != ReviewStatus.active) {
            throw new RuntimeException("Bạn không thể sửa review này");
        }

        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);

        return toResponseDto(review);
    }

    @Override
    public void deleteReview(Integer reviewId, Integer currentUserId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));
        if (!review.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Bạn không thể xóa review này");
        }
        review.setStatus(ReviewStatus.deleted);
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);
    }

    @Override
    public List<ReviewResponse> getReviewsByShowingTime(Integer showingTimeId) {
        return reviewRepository.findAllByShowingTime_IdAndStatus(showingTimeId, ReviewStatus.active)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByShowingTime(Integer showingTimeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewPage = reviewRepository.findByShowingTimeIdAndStatus(
                showingTimeId, ReviewStatus.active, pageable
        );
        return reviewPage.getContent()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // THÊM MỚI: Lấy tất cả review (không filter status)
    @Override
    public List<ReviewResponse> getAllReviewsByShowingTime(Integer showingTimeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewPage = reviewRepository.findByShowingTimeId(showingTimeId, pageable);
        return reviewPage.getContent()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByShowingTimeForAdmin(Integer showingTimeId, int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Review> reviewPage;

        if ("all".equalsIgnoreCase(status)) {
            // Lấy cả active và deleted
            reviewPage = reviewRepository.findByShowingTimeIdAndStatusIn(showingTimeId,
                    List.of(ReviewStatus.active, ReviewStatus.deleted), pageable);
        } else {
            ReviewStatus reviewStatus;
            try {
                reviewStatus = ReviewStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Trạng thái review không hợp lệ: " + status);
            }
            reviewPage = reviewRepository.findByShowingTimeIdAndStatus(showingTimeId, reviewStatus, pageable);
        }

        return reviewPage.getContent()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }


    @Override
    public List<Integer> getShowingTimeIdsByUserId(Integer userId) {
        List<Booking> bookings = bookingRepository.findByUserIdAndPaymentStatus(userId, "CONFIRMED");
        return bookings.stream()
                .map(b -> b.getShowingTime().getId())
                .distinct()
                .collect(Collectors.toList());
    }

    private ReviewResponse toResponseDto(Review r) {
        ReviewResponse dto = new ReviewResponse();
        dto.setReviewId(r.getId());
        dto.setShowingTimeId(r.getShowingTime().getId());
        dto.setUserId(r.getUser().getId());
        if (r.getUser() != null) {
            dto.setUserEmail(r.getUser().getEmail());
        }
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setStatus(r.getStatus().name());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    @Override
    public boolean hasUserReviewed(Integer showingTimeId, Integer userId) {
        return reviewRepository.existsByShowingTime_IdAndUser_IdAndStatus(
                showingTimeId, userId, ReviewStatus.active
        );
    }


}