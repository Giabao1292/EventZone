package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;

@Entity
public class PasswordResetToken {
    @Id
    private String token;

    @OneToOne
    private User user;

    private LocalDateTime expiryDate;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, User user) {
        this.token = token;
        this.user = user;
        this.expiryDate = LocalDateTime.now().plusMinutes(30);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }

    public User getUser() {
        return user;
    }

    // getter, setter...
}