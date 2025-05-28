package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginRequest {
    @NotBlank(message = "Username must be not blank")
    private String username;

    @NotBlank(message = "Password must be not blank")
    private String password;
}
