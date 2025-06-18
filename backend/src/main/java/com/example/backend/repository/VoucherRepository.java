package com.example.backend.repository;

import com.example.backend.model.Voucher;

import java.util.Optional;

public interface VoucherRepository {
    Optional<Voucher> findByVoucherCode(String voucherCode);
    boolean existsByVoucherCode(String voucherCode);

}
