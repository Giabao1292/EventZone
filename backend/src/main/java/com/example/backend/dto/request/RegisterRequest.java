package com.example.backend.dto.request;

import lombok.Getter;

import java.time.LocalDate;
import java.util.Date;

@Getter
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
}
