package com.example.backend.dto.request;

import lombok.Data;

@Data
public class BankRequest {
    private String bankName;
    private String accountNumber;
    private String holderName;
    private Integer isDefault;
}
