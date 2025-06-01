package com.example.backend.repository;

import com.example.backend.model.VerificationToken;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

public interface VerificationRepository extends JpaRepository<VerificationToken, Integer> {
    Optional<VerificationToken> findByTokenAndEmail(String token, String email);

    Optional<VerificationToken> findByEmail(@NotNull String email);

    void deleteByExpiryDateBefore(Instant now);
}
