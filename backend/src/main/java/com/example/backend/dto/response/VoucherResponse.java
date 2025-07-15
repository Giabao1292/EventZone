package com.example.backend.dto.response;

import com.example.backend.model.Voucher;
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
    public static VoucherResponse fromEntity(Voucher v) {
        return VoucherResponse.builder()
                .voucherId(v.getId())
                .status(v.getStatus())
                .voucherCode(v.getVoucherCode())
                .voucherName(v.getVoucherName())
                .description(v.getDescription())
                .requiredPoints(v.getRequiredPoints())
                .discountAmount(v.getDiscountAmount())
                .validFrom(v.getValidFrom())
                .validUntil(v.getValidUntil())
                .build();
    }
}

