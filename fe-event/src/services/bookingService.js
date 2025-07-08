import apiClient from "../api/axios";

const bookingService = {
  holdBooking: async (bookingData) => {
    try {
      const response = await apiClient.post("/bookings/hold", bookingData);
      return response.data.data; // Returns Booking object
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to hold booking"
      );
    }
  },

  getBookings: async () => {
    try {
      const response = await apiClient.get("/bookings/history");
      return response.data.data; // Trả về danh sách booking
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking history"
      );
    }
  },
};

export default bookingService;
