package com.example.backend.controller;

import com.example.backend.dto.response.*;
import com.example.backend.service.BookingService;
import com.example.backend.service.EventAdsService;
import com.example.backend.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/revenue")
@RequiredArgsConstructor
public class RevenueController {
    private final RevenueService revenueService;
    private final EventAdsService eventAdsService;
    private final BookingService bookingService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/time-series")
    public ResponseData<RevenueResponse> getRevenueInTimeSeries(@RequestParam(required = false, name ="orgName") String orgName, @RequestParam("groupBy") String groupBy, @RequestParam("type") String type, @RequestParam("from") LocalDate from, @RequestParam("to") LocalDate to) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get revenues in " + groupBy + " from " + from + " to " + to, revenueService.getRevenueInTimeSeries(orgName, groupBy, type, from, to));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/event-ads")
    public ResponseData<PageResponse<EventAdsRevenueResponse>> searchEventAds(@RequestParam(required = false, name = "orgName") String orgName, Pageable pageable, @RequestParam(required = false, name = "search") String... search) {
        PageResponse<EventAdsRevenueResponse> eventAdsRevenueResponses = eventAdsService.searchEventAds(orgName, pageable, search);
        return new ResponseData<>(HttpStatus.OK.value(), "Search EventAds succesfully", eventAdsRevenueResponses);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bookings")
    public ResponseData<PageResponse<BookingResponseDTO>> searchBooking(@RequestParam(required = false, name = "orgName") String orgName, Pageable pageable, @RequestParam(required = false, name = "search") String... search) {
        PageResponse<BookingResponseDTO> bookingResponseDTOS = bookingService.searchBooking(orgName, pageable, search);
        return new ResponseData<>(HttpStatus.OK.value(), "Search Booking succesfully", bookingResponseDTOS);
    }
}
