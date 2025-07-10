package com.example.backend.repository;

import com.example.backend.dto.request.WithdrawRequestDTO;
import com.example.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Integer> {
    boolean existsByEventAndShowingTime(Event event, ShowingTime showingTime);
    boolean existsByShowingTimeIdAndStatus(Integer showingTimeId, PaymentStatus status);
    List<WithdrawRequest> findByStatusIn(List<PaymentStatus> statuses);
    List<WithdrawRequest> findByOrganizerIdOrderByRequestedAtDesc(Integer organizerId);

}