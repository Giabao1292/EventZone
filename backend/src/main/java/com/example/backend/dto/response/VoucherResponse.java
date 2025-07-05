package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoucherResponse {
    private Integer voucherId;
    private Integer status;
    private String voucherCode;
    private String voucherName;
    private String description;
    private Integer requiredPoints;
    private BigDecimal discountAmount;
    private LocalDate validFrom;
    private LocalDate validUntil;
}

