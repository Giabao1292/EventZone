package com.example.backend.controller;

import com.example.backend.dto.request.OnCreate;
import com.example.backend.dto.request.UserVoucherResponse;
import com.example.backend.dto.request.VoucherRequest;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.VoucherResponse;
import com.example.backend.model.Voucher;
import com.example.backend.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/vouchers")
@Validated
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping("/me")
    public ResponseData<?> getUserVouchers() {
        UserVoucherResponse response = voucherService.getUserVouchers();
        return new ResponseData<>(HttpStatus.OK.value(), "Get user vouchers successful", response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<PageResponse<VoucherResponse>> getVouchers(Pageable pageable, String... search){
        PageResponse<VoucherResponse> pageResponse =  voucherService.searchVoucher(pageable, search);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list vouchers successful", pageResponse);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<?> updateVoucher(@PathVariable int id, @RequestBody VoucherRequest voucherRequest) {
        voucherService.updateVoucher(id, voucherRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "Update voucher successful");
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<PageResponse<VoucherResponse>> updateStatusVoucher(@PathVariable int id, int status) {
        voucherService.updateStatus(id, status);
        return new ResponseData<>(HttpStatus.OK.value(), "Inactive voucher successful");
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<?> createVoucher(@Validated(OnCreate.class) @Valid @RequestBody VoucherRequest voucherRequest) {
        voucherService.createVoucher(voucherRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "Create voucher successful");
    }
    @PostMapping("/{id}/redeem")
    @PreAuthorize("hasRole('USER')")
    public ResponseData<?> redeemVoucher(@PathVariable("id") int voucherId) {
        voucherService.redeemVoucher(voucherId);
        return new ResponseData<>(HttpStatus.OK.value(), "Redeem voucher successful");
    }
}
