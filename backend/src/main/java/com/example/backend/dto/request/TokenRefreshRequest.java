package com.example.backend.dto.request;

import lombok.Getter;

@Getter
public class TokenRefreshRequest {
    private String refreshToken;
}
