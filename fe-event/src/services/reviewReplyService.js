import apiClient from "../api/axios";

const reviewReplyService = {
    // Lấy tất cả reply của 1 review
    getRepliesByReview: (reviewId) =>
        apiClient.get(`/review-replies/review/${reviewId}`)
            .then(res => res.data.data),

    // Tạo reply
    createReply: (payload) =>
        apiClient.post(`/review-replies`, payload)
            .then(res => res.data.data),

    // Sửa reply
    updateReply: (id, payload) =>
        apiClient.put(`/review-replies/${id}`, payload)
            .then(res => res.data.data),

    // Xóa reply
    deleteReply: (id) =>
        apiClient.delete(`/review-replies/${id}`)
            .then(res => res.data),
};

export default reviewReplyService;
