package com.example.backend.repository;

import com.example.backend.model.Booking;
import com.example.backend.model.Review;
import com.example.backend.model.ReviewStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    // Lấy 1 review của user cho 1 showingTime (còn active)
    Optional<Review> findByShowingTime_IdAndUser_IdAndStatus(Integer showingTimeId, Integer userId, ReviewStatus status);

    // Lấy tất cả review (còn active) của 1 showingTime
    List<Review> findAllByShowingTime_IdAndStatus(Integer showingTimeId, ReviewStatus status);

    // Kiểm tra user đã review showingTime này chưa (còn active)
    boolean existsByShowingTime_IdAndUser_IdAndStatus(Integer showingTimeId, Integer userId, ReviewStatus status);

    Page<Review> findByShowingTimeIdAndStatus(Integer showingTimeId, ReviewStatus status, Pageable pageable);

    List<Booking> findByUserIdAndStatus(Integer userId, String status);

    Page<Review> findByShowingTimeId(Integer showingTimeId, Pageable pageable);

    Page<Review> findByShowingTimeIdAndStatusIn(Integer showingTimeId, List<ReviewStatus> statusList, Pageable pageable);



}




