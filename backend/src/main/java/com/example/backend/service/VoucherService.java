package com.example.backend.service;

import com.example.backend.dto.request.UserVoucherResponse;
import com.example.backend.dto.request.VoucherRequest;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.dto.response.VoucherResponse;
import org.springframework.data.domain.Pageable;

public interface VoucherService {
    PageResponse<VoucherResponse> searchVoucher(Pageable pageable, String... search);
    void updateVoucher(int id, VoucherRequest voucherRequest);
    void updateStatus(int id, int status);
    void redeemVoucher(int voucherId);
    void createVoucher(VoucherRequest voucherRequest);
    UserVoucherResponse getUserVouchers();
}
