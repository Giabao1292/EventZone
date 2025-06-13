package com.example.backend.dto.request;

import com.example.backend.model.Role;
import com.example.backend.util.Phone;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Set;

@Setter
@Getter
public class UserRequestDTO {
    @NotBlank(message = "Fullname must not be blank")
    private String fullName;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone must not be blank")
    @Phone
    private String phone;

    @NotNull(message = "dateOfBirth must be not null!")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateOfBirth;

    @NotBlank(message = "email must not be blank")
    @Email(message = "Invalid email")
    private String email;

    @Min(0)
    @Max(1)
    @NotBlank(message = "Status must not be blank")
    private Integer status;

    @NotEmpty(message = "Roles must be have one role")
    private Set<String> roles;
}
