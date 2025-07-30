package com.example.backend.service;


import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.*;
import com.example.backend.model.Booking;
import com.example.backend.model.PaymentStatus;
import com.example.backend.model.User;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {
    Booking holdBooking(BookingRequest request, User user);

    Booking confirmBooking(Integer bookingId, String paymentMethod) throws IOException, MessagingException;

    PageResponse<AttendeeResponse> searchAttendees(Pageable pageable, int eventId, LocalDateTime startTime, String[] search);

    void checkIn(Integer id);

    AnalyticAttendeesResponse getAnalytics(int eventId, LocalDateTime startTime);

    List<BookingHistoryDTO> getBookingHistory(String username);

    List<Integer> getConfirmedShowingTimeIdsByUserId(Integer userId);


    List<Booking> findByUserIdAndPaymentStatus(Integer userId, String paymentStatus);

    PageResponse<BookingResponseDTO> searchBooking(String orgName, Pageable pageable, String[] search);

}
