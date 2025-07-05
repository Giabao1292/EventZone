package com.example.backend.service;

import com.example.backend.dto.request.EventAdsRequest;
import com.example.backend.dto.response.EventAdsResponse;
import com.example.backend.model.EventAds;
import com.example.backend.model.User;

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
}
