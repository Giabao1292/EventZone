import apiClient from "../api/axios";

export const createShowingTime = async (showingTimeData) => {
    try {
        // Nếu BE nhận nhiều suất chiếu/lần thì truyền mảng, còn chỉ 1 thì wrap vào mảng
        const requestData = Array.isArray(showingTimeData)
            ? showingTimeData
            : [showingTimeData];

        const response = await apiClient.post(
            "/events/showing-times/create",
            {
                // Format chuẩn cho BE, tuỳ BE yêu cầu, bạn có thể truyền thêm các trường khác
                ...showingTimeData, // nếu BE yêu cầu object, ngược lại thì truyền requestData
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            }
        );
        // response.data phải chứa mảng các suất chiếu có id
        // Nếu response.data.data là mảng -> trả về luôn mảng đó
        if (Array.isArray(response.data?.data)) {
            return response.data.data; // Danh sách showingTime có id
        }
        // Nếu response.data.data là object -> trả về object đó
        return response.data.data;
    } catch (err) {
        const errMsg =
            err.response?.data?.message ||
            err.message ||
            "Failed to create showing time";
        throw new Error(errMsg);
    }
};



export const updateShowingTime = async (showingTimeId, showingTimeData) => {
    try {
        const response = await apiClient.put(
            `/events/showing-times/${showingTimeId}`,
            showingTimeData,
            {
                headers: { "Content-Type": "application/json" },
                timeout: 15000,
            }
        );
        return response.data;
    } catch (err) {
        const errMsg =
            err.response?.data?.message || "Failed to update showing time";
        throw new Error(errMsg);
    }
};
