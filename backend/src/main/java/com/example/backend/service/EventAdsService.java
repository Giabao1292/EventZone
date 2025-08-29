package com.example.backend.service;

import com.example.backend.dto.request.EventAdsRequest;
import com.example.backend.dto.response.EventAdsResponse;
import com.example.backend.dto.response.EventAdsRevenueResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.model.EventAds;
import com.example.backend.model.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventAdsService {
    EventAds holdAds(EventAdsRequest request, User user);
    EventAds getById(Integer id);
    void confirmAds(Integer adsId, String paymentMethod);
     EventAdsResponse toResponse(EventAds ads);
    void confirmAdsPayment(Integer adsId, String paymentMethod, String transactionId);
    void reviewAds(Integer adsId, EventAds.AdsStatus newStatus, String note);
    List<EventAds> getByStatus(EventAds.AdsStatus status);
    List<EventAds> getAll();
    List<EventAdsResponse> getActiveAdsToday();
    PageResponse<EventAdsRevenueResponse> searchEventAds(String orgName,Pageable pageable, String[] search);
}
