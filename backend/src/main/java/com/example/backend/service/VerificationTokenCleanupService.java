package com.example.backend.service;

import com.example.backend.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class VerificationTokenCleanupService {

    private final VerificationRepository tokenRepository;
    private final TransactionTemplate transactionTemplate;

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void deleteExpiredTokens() {
        transactionTemplate.execute(status -> {
            tokenRepository.deleteByExpiryDateBefore(Instant.now());
            return null;
        });
    }
}
