package com.example.backend.service;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.model.Booking;

import java.util.List;

public interface BookingService {
    Booking createBooking(BookingRequest request);

    Booking confirmPayment(Integer bookingId);

    void cancelExpiredBookings();

    Booking getBookingById(Integer bookingId);

    List<Booking> getBookingsByUser(Integer userId);
}
