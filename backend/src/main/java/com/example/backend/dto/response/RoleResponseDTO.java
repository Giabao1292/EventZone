package com.example.backend.dto.response;


import com.example.backend.util.RoleName;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponseDTO {
    private String roleName;
}
