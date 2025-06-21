// src/services/bookingService.js

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
};
export default bookingService;
