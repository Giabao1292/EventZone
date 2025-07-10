package com.example.backend.service.impl;

import com.example.backend.dto.request.ReviewReplyRequest;
import com.example.backend.dto.response.ReviewReplyResponse;
import com.example.backend.model.Organizer;
import com.example.backend.model.Review;
import com.example.backend.model.ReviewReply;
import com.example.backend.model.ShowingTime;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.OrganizerRepository;
import com.example.backend.repository.ReviewReplyRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.ShowingTimeRepository;
import com.example.backend.service.ReviewReplyService;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReviewReplyServiceImpl implements ReviewReplyService {
    private final ReviewReplyRepository reviewReplyRepository;
    private final ReviewRepository reviewRepository;
    private final ShowingTimeRepository showingTimeRepository;
    private final OrganizerRepository organizerRepository;

    private Organizer getOrganizerByUserEmail(String email) {
        return organizerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer không tồn tại cho email: " + email));
    }

    @Override
    public void checkOrganizerCanReply(Integer reviewId, String organizerEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review không tồn tại"));

        Organizer organizer = getOrganizerByUserEmail(organizerEmail);
        ShowingTime showingTime = showingTimeRepository.findById(review.getShowingTime().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Suất chiếu không tồn tại"));

        if (!showingTime.getEvent().getOrganizer().getId().equals(organizer.getId())) {
            throw new RuntimeException("Bạn không có quyền trả lời review này!");
        }
    }

    @Override
    public void checkOrganizerCanUpdateOrDeleteReply(Integer replyId, String organizerEmail) {
        ReviewReply reply = reviewReplyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply không tồn tại"));
        Review review = reply.getReview();
        if (review == null) {
            throw new ResourceNotFoundException("Review không tồn tại");
        }

        Organizer organizer = getOrganizerByUserEmail(organizerEmail);
        ShowingTime showingTime = showingTimeRepository.findById(review.getShowingTime().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Suất chiếu không tồn tại"));
        if (!showingTime.getEvent().getOrganizer().getId().equals(organizer.getId())) {

            throw new RuntimeException("Bạn không có quyền thao tác với reply này!");
        }
    }

    @Override
    public ReviewReplyResponse createReply(ReviewReplyRequest request, String organizerEmail) {
        Review review = reviewRepository.findById(request.getReviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Review không tồn tại"));

        Organizer organizer = getOrganizerByUserEmail(organizerEmail);

        ReviewReply reply = new ReviewReply();
        reply.setReview(review);
        reply.setContent(request.getContent());
        reply.setOrganizer(organizer); // ✅ truyền đối tượng Organizer

        ReviewReply saved = reviewReplyRepository.save(reply);
        return mapToResponse(saved);
    }


    @Override
    public ReviewReplyResponse updateReply(Integer id, ReviewReplyRequest request, String organizerEmail) {
        ReviewReply reply = reviewReplyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reply không tồn tại"));
        reply.setContent(request.getContent());

        ReviewReply updated = reviewReplyRepository.save(reply);
        return mapToResponse(updated);
    }

    @Override
    public void deleteReply(Integer id, String organizerEmail) {
        ReviewReply reply = reviewReplyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reply không tồn tại"));
        reviewReplyRepository.delete(reply);
    }

    @Override
    public List<ReviewReplyResponse> getRepliesByReviewId(Integer reviewId) {
        List<ReviewReply> replies = reviewReplyRepository.findByReviewId(reviewId);
        return replies.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ReviewReplyResponse mapToResponse(ReviewReply reply) {
        ReviewReplyResponse resp = new ReviewReplyResponse();
        resp.setId(reply.getId());
        resp.setReviewId(reply.getReview() != null ? reply.getReview().getId() : null);
        resp.setOrganizerId(reply.getOrganizer() != null ? reply.getOrganizer().getId() : null);
        resp.setContent(reply.getContent());
        resp.setCreatedAt(reply.getCreatedAt());
        resp.setUpdatedAt(reply.getUpdatedAt());
        return resp;
    }

}