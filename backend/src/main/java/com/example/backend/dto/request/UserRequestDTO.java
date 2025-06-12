package com.example.backend.dto.request;

import com.example.backend.model.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Setter
@Getter
public class UserRequestDTO {
    private String fullName;
    private String password;
    private String phone;
    private LocalDate dateOfBirth;
    private String email;
    private Integer status;
    private Set<String> roles;
}
