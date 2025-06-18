package com.example.backend.dto.response;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoneDTO {
    private Integer id;
    private String zoneName;
    private String type;
    private BigDecimal price;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private Integer capacity;
    private boolean available;
}
