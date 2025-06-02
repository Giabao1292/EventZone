package com.example.backend.service;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.model.User;

public interface VerificationService {
    public Boolean validateToken(String token, String email);
    public String generateToken();
    public String resendToken(String email);
    public void save(String email, String token);
    public void save(RegisterRequest registerRequest, String token);
    void saveResetToken(User user, String token);

}
