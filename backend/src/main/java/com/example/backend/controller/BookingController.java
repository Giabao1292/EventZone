package com.example.backend.controller;


import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.Booking;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.BookingService;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final UserRepository userRepository;
    @PostMapping("/hold")
    public ResponseData<Booking> hold(@RequestBody BookingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(); // inject thêm userRepository
        Booking booking = bookingService.holdBooking(request, user);
        return new ResponseData<>(HttpStatus.OK.value(), "Hold successful", booking);
    }
}
