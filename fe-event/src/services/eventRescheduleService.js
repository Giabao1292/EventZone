import apiClient from "../api/axios";

const eventRescheduleService = {
    // Tạo yêu cầu dời lịch sự kiện
    createRequest: (dto) =>
        apiClient
            .post(`/event-reschedule-requests`, dto)
            .then((res) => res.data.data),

    // Lấy danh sách yêu cầu dời lịch theo trạng thái (Admin)
    getRequestsByStatus: (status) =>
        apiClient
            .get(`/event-reschedule-requests`, {
                params: { status },
            })
            .then((res) => res.data.data),

    // Lấy chi tiết 1 yêu cầu theo id
    getRequestById: (id) =>
        apiClient
            .get(`/event-reschedule-requests/${id}`)
            .then((res) => res.data.data),

    // Duyệt yêu cầu (Admin)
    approveRequest: (id, adminUserId) =>
        apiClient.post(
            `/event-reschedule-requests/${id}/approve`,
            null,
            {
                params: { adminUserId: Number(adminUserId) },
                timeout: 20000,
            }
        )
            .then(res => res.data)
            .catch(err => {
                if (err.response) {
                    console.error("Backend error response:", err.response.data);
                } else if (err.request) {
                    console.error("No response from backend:", err.request);
                } else {
                    console.error("Request error:", err.message);
                }
                throw err;
            }),



    // Từ chối yêu cầu (Admin)
    // Chỉ cần ép kiểu số cho adminUserId ở đây luôn
    rejectRequest: (id, adminUserId, adminNote) =>
        apiClient.post(`/event-reschedule-requests/${id}/reject`, null, {
            params: { adminUserId: Number(adminUserId), adminNote },
        }),




    // Chỉ dùng nếu backend có hỗ trợ endpoint này
    getRequestsByEventId: (eventId) =>
        apiClient
            .get(`/event-reschedule-requests/event/${eventId}`)
            .then(res => res.data.data),

};

export default eventRescheduleService;
