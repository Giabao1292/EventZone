import apiClient from "../api/axios";

const reviewService = {
    // Lấy danh sách bình luận của suất chiếu, có thêm param status (mặc định 'active')
    getReviews: (showingTimeId, status = "active") =>
        apiClient.get(`/reviews`, {
            params: { showingTimeId, status }
        }).then(res => res.data.data),

    // Lấy danh sách review dành cho admin theo suất chiếu, phân trang, filter status
    getReviewsForAdmin: (showingTimeId, page = 0, size = 10, status = "active") =>
        apiClient.get(`/reviews/admin/showing-time/${showingTimeId}`, {
            params: { page, size, status }
        }).then(res => res.data.data),

    // Tạo bình luận
    submitReview: (showingTimeId, payload, userId) =>
        apiClient.post(`/reviews?currentUserId=${userId}`, {
            showingTimeId,
            rating: payload.rating,
            comment: payload.comment
        }).then(res => res.data.data),



    // Sửa review (update tất cả field trong payload: rating, comment, status...)
    updateReview: (reviewId, payload, userId) =>
        apiClient.put(`/reviews/${reviewId}?currentUserId=${userId}`, payload)
            .then(res => res.data.data),

    // Xóa review (hiện tại là xóa mềm = đổi status thành deleted)
    deleteReview: (reviewId, userId) =>
        apiClient.delete(`/reviews/${reviewId}`, {
            params: { currentUserId: userId }
        }).then(res => res.data.data),

    // Kiểm tra đã đánh giá chưa
    hasUserReviewed: (showingTimeId, userId) =>
        apiClient.get(`/reviews/has-reviewed`, {
            params: { showingTimeId, currentUserId: userId }
        }).then(res => res.data.data.hasReviewed),
};

export default reviewService;
