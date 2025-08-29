package com.example.backend.repository;

import com.example.backend.model.Event;
import com.example.backend.model.EventAds;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

    @Query("SELECT e.id FROM EventAds e " +
            "WHERE (:orgName IS NULL OR e.organizer.orgName LIKE %:orgName%)")
    Page<Long> findAllIdsEventAds(String orgName, Pageable pageable);

    @Query("SELECT ea FROM EventAds ea LEFT " +
            "JOIN FETCH ea.event e " +
            "LEFT JOIN FETCH ea.organizer " +
            "WHERE ea.id IN :ids ORDER BY ea.createdAt DESC ")
    List<EventAds> findAllEventAdsByIds(List<Long> ids);
}
