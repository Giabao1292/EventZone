package com.example.backend.service;


import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.UserDetailResponse;
import com.example.backend.model.Booking;
import com.example.backend.model.User;

import java.io.IOException;
import java.util.List;

public interface BookingService {
    Booking holdBooking(BookingRequest request, User user);
    Booking confirmBooking(Integer bookingId, String payment) throws IOException;
}
