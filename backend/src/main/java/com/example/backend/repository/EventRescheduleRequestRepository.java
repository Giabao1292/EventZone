package com.example.backend.repository;

import com.example.backend.model.EventRescheduleRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRescheduleRequestRepository extends JpaRepository<EventRescheduleRequest, Integer> {
    List<EventRescheduleRequest> findByStatus_StatusName(String statusName);
    List<EventRescheduleRequest> findByEventId(Integer eventId);
    List<EventRescheduleRequest> findByShowingTimeIdAndStatus_StatusName(Integer showingTimeId, String statusName);
}
