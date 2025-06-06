package com.example.backend.service;

public interface VerificationService {
    public Boolean validateToken(String token, String email);
    public String generateToken();
    public String resendToken(String email);
    public void save(String email, String token);
}
