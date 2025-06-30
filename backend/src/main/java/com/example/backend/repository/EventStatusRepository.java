package com.example.backend.repository;

import com.example.backend.model.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventStatusRepository extends JpaRepository<EventStatus, Integer> {
    Optional<EventStatus> findByStatusName(String statusName);
}
