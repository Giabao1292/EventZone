import apiClient from "../api/axios";

const reviewService = {
    getReviews: (showingTimeId) =>
        apiClient.get(`/reviews?showingTimeId=${showingTimeId}`).then(res => res.data.data),
    submitReview: (showingTimeId, payload, userId) =>
        apiClient.post(`/reviews?currentUserId=${userId}`, {
            showingTimeId,
            rating: payload.rating,
            comment: payload.comment
        }).then(res => res.data.data),
};

export default reviewService;
