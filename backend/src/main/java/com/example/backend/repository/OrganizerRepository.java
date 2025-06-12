package com.example.backend.repository;

import com.example.backend.model.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer, Integer> {
    Optional<Organizer> findByUserId(int userId);
}
