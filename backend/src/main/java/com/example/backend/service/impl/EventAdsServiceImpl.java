package com.example.backend.service.impl;


import com.example.backend.dto.request.EventAdsRequest;
import com.example.backend.dto.response.EventAdsResponse;
import com.example.backend.model.*;
import com.example.backend.repository.EventAdsRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.OrganizerRepository;
import com.example.backend.service.EventAdsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventAdsServiceImpl implements EventAdsService {

    private final EventAdsRepository eventAdsRepository;
    private final EventRepository eventRepository;
    private final OrganizerRepository organizerRepository;

    public EventAds holdAds(EventAdsRequest request, User user) {
        Event event = eventRepository.findById(Math.toIntExact(request.getEventId()))
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Organizer organizer = organizerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        // 🔒 Kiểm tra sự kiện đã được quảng cáo chưa
        boolean alreadyAdvertised = eventAdsRepository.existsByEvent(event);
        if (alreadyAdvertised) {
            throw new RuntimeException("This event has already been advertised.");
        }

        EventAds ads = EventAds.builder()
                .event(event)
                .organizer(organizer)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(request.getTotalPrice())
                .status(EventAds.AdsStatus.PENDING)
                .refundStatus(EventAds.RefundStatus.NONE)
                .bannerImageUrl(request.getBannerImageUrl())
                .build();

        return eventAdsRepository.save(ads);
    }

    public EventAds getById(Integer id) {
        return eventAdsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EventAds not found"));
    }

    public void confirmAds(Integer adsId, String paymentMethod) {
        EventAds ads = getById(adsId);
        ads.setStatus(EventAds.AdsStatus.PENDING); // hoặc APPROVED nếu cần duyệt tự động
        ads.setPaymentGateway(EventAds.PaymentGateway.valueOf(paymentMethod.toUpperCase()));
        eventAdsRepository.save(ads);
    }
    public void confirmAdsPayment(Integer adsId, String paymentMethod, String transactionId) {
        EventAds ads = getById(adsId);
        ads.setStatus(EventAds.AdsStatus.PENDING);
        ads.setPaymentGateway(EventAds.PaymentGateway.valueOf(paymentMethod.toUpperCase()));
        ads.setPaymentTransactionId(transactionId);

        eventAdsRepository.save(ads);
    }
    public void reviewAds(Integer adsId, EventAds.AdsStatus status, String reason) {
        EventAds ads = getById(adsId);
        if (ads.getStatus() != EventAds.AdsStatus.PENDING) {
            throw new IllegalStateException("Chỉ xử lý quảng cáo đang chờ duyệt");
        }
        ads.setStatus(status);
        ads.setRejectionReason(status == EventAds.AdsStatus.REJECTED ? reason : null);
        eventAdsRepository.save(ads);
    }
    public List<EventAdsResponse> getActiveAdsToday() {
        LocalDate today = LocalDate.now();
        return eventAdsRepository.findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        EventAds.AdsStatus.APPROVED, today, today)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    public EventAdsResponse toResponse(EventAds ads) {
        return EventAdsResponse.builder()
                .id(ads.getId())
                .eventId(ads.getEvent().getId())
                .eventTitle(ads.getEvent().getEventTitle())
                .organizerId(ads.getOrganizer().getId())
                .organizerName(ads.getOrganizer().getUser().getFullName())
                .startDate(LocalDate.from(ads.getEvent().getStartTime()))
                .endDate(ads.getEvent().getEndTime().toLocalDate())
                .bannerImageUrl(ads.getBannerImageUrl())
                .posterImage(ads.getEvent().getPosterImage())
                .status(ads.getStatus().name())
                .build();
    }
    public List<EventAds> getAll() {
        return eventAdsRepository.findAll();
    }

    public List<EventAds> getByStatus(EventAds.AdsStatus status) {
        return eventAdsRepository.findByStatus(status);
    }

}
