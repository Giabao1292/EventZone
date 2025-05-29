package com.example.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateProfileRequest {
    private String username;
    private String fullName;
    private String email;
    private String phone;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dateOfBirth;
}
