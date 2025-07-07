package com.example.backend.service.impl;

import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.model.*;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.ShowingTimeRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ShowingTimeRepository showingTimeRepository; // Thay cho EventRepository
    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest dto, Integer currentUserId) {
        // 1. Kiểm tra showingTime tồn tại
        ShowingTime showingTime = showingTimeRepository.findById(dto.getShowingTimeId())
                .orElseThrow(() -> new RuntimeException("Suất chiếu không tồn tại"));

        // 2. Kiểm tra suất chiếu đã kết thúc chưa
        if (showingTime.getEndTime().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Chỉ được đánh giá sau khi suất chiếu kết thúc");
        }

        // 3. Kiểm tra user đã mua vé suất chiếu này chưa
        boolean hasBooking = bookingRepository.existsByShowingTime_IdAndUser_Id(dto.getShowingTimeId(), currentUserId);
        if (!hasBooking) {
            throw new RuntimeException("Bạn chưa tham gia suất chiếu này!");
        }

        // 4. Kiểm tra đã review chưa (chỉ 1 review/user/showingTime)
        boolean exists = reviewRepository.existsByShowingTime_IdAndUser_IdAndStatus(dto.getShowingTimeId(), currentUserId, ReviewStatus.active);
        if (exists) {
            throw new RuntimeException("Bạn đã đánh giá suất chiếu này rồi!");
        }

        // 5. Tạo review mới
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

    @Override
    public List<Integer> getShowingTimeIdsByUserId(Integer userId) {
        // Chỉ lấy booking đã xác nhận thành công, tránh lấy cả booking đã hủy
        List<Booking> bookings = bookingRepository.findByUserIdAndPaymentStatus(userId, "CONFIRMED");
        return bookings.stream()
                .map(b -> b.getShowingTime().getId())
                .distinct()
                .collect(Collectors.toList());
    }


    // Mapping entity -> response DTO
    private ReviewResponse toResponseDto(Review r) {
        ReviewResponse dto = new ReviewResponse();
        dto.setReviewId(r.getId());
        dto.setShowingTimeId(r.getShowingTime().getId());
        // dto.setEventId(r.getShowingTime().getEvent().getId()); // Nếu muốn trả luôn eventId
        dto.setUserId(r.getUser().getId());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setStatus(r.getStatus().name());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }
}
