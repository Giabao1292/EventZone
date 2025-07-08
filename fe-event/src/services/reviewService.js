import apiClient from "../api/axios";

const reviewService = {
    // Lấy danh sách bình luận của suất chiếu
    getReviews: (showingTimeId) =>
        apiClient.get(`/reviews?showingTimeId=${showingTimeId}`)
            .then(res => res.data.data),

    // Tạo bình luận
    submitReview: (showingTimeId, payload, userId) =>
        apiClient.post(`/reviews?currentUserId=${userId}`, {
            showingTimeId,
            rating: payload.rating,
            comment: payload.comment
        }).then(res => res.data.data),

    // Sửa review
    updateReview: (reviewId, payload, userId) =>
        apiClient.put(`/reviews/${reviewId}?currentUserId=${userId}`, {
            rating: payload.rating,
            comment: payload.comment
        }).then(res => res.data.data),

    // Xóa review
    deleteReview: (reviewId, userId) =>
        apiClient.delete(`/reviews/${reviewId}?currentUserId=${userId}`)
            .then(res => res.data.data),

    // Kiểm tra đã đánh giá chưa
    hasUserReviewed: (showingTimeId, userId) =>
        apiClient.get(`/reviews/has-reviewed?showingTimeId=${showingTimeId}&currentUserId=${userId}`)
            .then(res => res.data.data.hasReviewed),
};

export default reviewService;
