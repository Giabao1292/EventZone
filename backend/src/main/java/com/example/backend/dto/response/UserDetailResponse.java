package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDetailResponse {
    private int id;
    private String fullname;
    private String email;
    private String username;
    private String phone;
    private String profileUrl;
    private LocalDate dateOfBirth;
}
