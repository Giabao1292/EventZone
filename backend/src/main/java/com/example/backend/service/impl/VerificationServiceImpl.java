package com.example.backend.service.impl;

import com.cloudinary.utils.StringUtils;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.VerificationToken;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationRepository;
import com.example.backend.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {
    private final VerificationRepository verificationRepository;
    private final SecureRandom random = new SecureRandom();
    @Override
    public Boolean validateToken(String token, String email) {
        VerificationToken verificationToken = verificationRepository.findByTokenAndEmail(token, email).orElseThrow(() -> new ResourceNotFoundException("Wrong code"));
        if(verificationToken.getExpiryDate().isBefore(Instant.now())){
            verificationRepository.delete(verificationToken);
            throw new ResourceNotFoundException("Code is expired, please resend mail!");
        }
        return true;
    }
    @Override
    public void save(String email, String token){
        VerificationToken verificationToken = VerificationToken.builder().email(email).token(token).expiryDate(Instant.now().plus(5, ChronoUnit.MINUTES)).build();
        verificationRepository.save(verificationToken);
    }
    @Override
    public String generateToken() {
        int token = 100000 + random.nextInt(9000000);
        return String.valueOf(token);
    }
    @Override
    public String resendToken(String email) {
        if (StringUtils.isBlank(email)) {
            throw new ResourceNotFoundException("Expired time, please register again!");
        }
        VerificationToken existingToken = verificationRepository.findByEmail(email).orElse(null);
        if (existingToken != null && validateToken(existingToken.getToken(), existingToken.getEmail())) {
            return existingToken.getToken();
        }
        VerificationToken newToken = VerificationToken.builder()
                .email(email)
                .token(generateToken())
                .expiryDate(Instant.now().plus(5, ChronoUnit.MINUTES))
                .build();
        verificationRepository.save(newToken);
        return newToken.getToken();
    }

}
