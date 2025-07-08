import apiClient from "../api/axios";

const reviewService = {
    //lấy danh sách bình luận của suất chiếu
    getReviews: (showingTimeId) =>
        apiClient.get(`/reviews?showingTimeId=${showingTimeId}`)
            .then(res => res.data.data),

    //tạo bình luận
    submitReview: (showingTimeId, payload, userId) =>
        apiClient.post(`/reviews?currentUserId=${userId}`, {
            showingTimeId,
            rating: payload.rating,
            comment: payload.comment
        }).then(res => res.data.data),

    // Sửa review phải truyền userId vào query param!
    updateReview: (reviewId, payload, userId) =>
        apiClient.put(`/reviews/${reviewId}?currentUserId=${userId}`, {
            rating: payload.rating,
            comment: payload.comment
        }).then(res => res.data.data),

    // Xóa review cũng truyền userId vào query param!
    deleteReview: (reviewId, userId) =>
        apiClient.delete(`/reviews/${reviewId}?currentUserId=${userId}`)
            .then(res => res.data.data),
};

export default reviewService;
