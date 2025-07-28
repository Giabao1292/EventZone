package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BankResponse {
    private Integer paymentId;
    private String endAccountNumber;
    private String bankName;
    private String holderName;
    private Integer isDefault;
}
