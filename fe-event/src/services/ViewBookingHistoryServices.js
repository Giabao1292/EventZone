// src/services/ViewBookingHistoryServices.js
import apiClient from "../api/axios";

const ViewBookingHistoryService = {
  async getBookings() {
    try {
      const response = await apiClient.get("/bookings/history"); // ✅ đúng endpoint
      if (response.data.code === 200) {
        return response.data.data || [];
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking history"
      );
    }
  },
};

export default ViewBookingHistoryService;
