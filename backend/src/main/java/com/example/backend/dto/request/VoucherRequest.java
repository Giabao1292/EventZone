package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class VoucherRequest{

    @NotBlank(message = "VoucherCode must not be blank")
    private String voucherCode;

    @NotBlank(message = "VoucherName must not be blank")
    private String voucherName;

    @NotBlank(message = "Description must not be blank")
    private String description;

    @NotNull(message = "RequiredPoints must not be null")
    private Integer requiredPoints;

    @NotNull(message = "DiscountAmount must not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "DiscountAmount must be greater than zero")
    private BigDecimal discountAmount;

    @NotNull(message = "ValidFrom must not be null")
    private LocalDate validFrom;

    @FutureOrPresent(message = "ValidUntil date must be not in the past", groups = {OnCreate.class})
    @NotNull(message = "ValidUntil must not be null")
    private LocalDate validUntil;
    private int status;
}
