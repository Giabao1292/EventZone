package com.example.backend.dto.response;

import lombok.*;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private int id;
    private String venueName;
    private String location;
    private String city;
}
