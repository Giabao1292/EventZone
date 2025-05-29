package com.example.backend.repository;

import com.example.backend.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

public interface VerificationRepository extends JpaRepository<VerificationToken, Integer> {
    Optional<VerificationToken> findByTokenAndExpiryDateAfter(String token, Instant expireDate);
}
