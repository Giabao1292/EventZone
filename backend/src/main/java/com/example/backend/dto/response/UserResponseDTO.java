package com.example.backend.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDTO {
    private Integer id;
    private String email;
    private String verifyToken;
}
