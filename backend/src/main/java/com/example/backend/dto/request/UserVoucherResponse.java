package com.example.backend.dto.request;

import com.example.backend.dto.response.VoucherResponse;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
public class UserVoucherResponse {
    private List<VoucherResponse> redeemedVouchers; // Đã đổi
    private List<VoucherResponse> availableVouchers; // Có thể đổi


    public UserVoucherResponse(List<VoucherResponse> redeemedResponses, List<VoucherResponse> availableResponses) {
        this.redeemedVouchers = redeemedResponses;
        this.availableVouchers = availableResponses;
    }
}
