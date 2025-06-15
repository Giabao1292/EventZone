package com.example.backend.dto.request;

import com.example.backend.util.Phone;
import com.example.backend.util.RoleName;
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
    @NotBlank(message = "Email must not be blank")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Password must not be blank", groups = {OnCreate.class})
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "FullName must not be blank")
    private String fullName;

    @NotBlank(message = "Phone must not be blank")
    @Phone
    private String phone;

    @NotNull(message = "dateOfBirth must be not null!")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateOfBirth;

    @Min(0)
    @Max(1)
    @NotNull(message = "Status must not be null")
    private Integer status;

    @NotNull(message = "Roles cannot be null")
    @NotEmpty(message = "Roles must be have at least one role")
    private Set<RoleName> roles;
}
