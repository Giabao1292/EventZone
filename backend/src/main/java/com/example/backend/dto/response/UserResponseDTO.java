package com.example.backend.dto.response;

import com.example.backend.model.Role;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDTO {
    private Integer id;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private String email;
    private Integer score;
    private Integer status;
    private Set<String> roles;
}
