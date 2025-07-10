package com.example.backend.repository;

import com.example.backend.model.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Integer> {
    List<ReviewReply> findByReviewId(Integer reviewId);
}
