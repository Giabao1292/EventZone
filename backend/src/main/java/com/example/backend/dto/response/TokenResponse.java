package com.example.backend.dto.response;

import com.example.backend.model.Role;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private List<String> roles;
}
