package com.example.backend.service;

import com.example.backend.dto.projection.RevenueBucketView;
import com.example.backend.dto.response.RevenueDetail;
import com.example.backend.dto.response.RevenueResponse;
import com.example.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final BookingRepository bookingRepository;

    public RevenueResponse getRevenueInTimeSeries(String orgName, String groupBy, String type, LocalDate from, LocalDate to){
        String format = groupBy.equals("day") ? "%d/%m" : "%m/%Y" ;
        List<RevenueBucketView> revenueBucketViews = bookingRepository.findRevenueInTimeSeries(orgName, format, type, from, to.plusDays(1));
        BigDecimal adsRevenue = revenueBucketViews.stream().map(RevenueBucketView::getAds).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal ticketSellingRevenue = revenueBucketViews.stream().map(RevenueBucketView::getBooking).reduce(BigDecimal.ZERO, BigDecimal::add);
        return RevenueResponse.builder()
                .eventAdsRevenue(adsRevenue)
                .ticketSellingRevenue(ticketSellingRevenue)
                .revenueDetails(revenueBucketViews.stream().map(rv -> RevenueDetail.builder()
                        .ads(rv.getAds())
                        .booking(rv.getBooking())
                        .bucket(rv.getBucket())
                        .build()).toList())
                .build();
    }
}
