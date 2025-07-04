package com.example.backend.repository;

import com.example.backend.model.Event;
import com.example.backend.model.EventAds;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventAdsRepository extends JpaRepository<EventAds, Integer> {
    boolean existsByEvent(Event event);
    List<EventAds> findByStatus(EventAds.AdsStatus status);
    List<EventAds> findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            EventAds.AdsStatus status,
            LocalDate startDate,
            LocalDate endDate
    );
}
