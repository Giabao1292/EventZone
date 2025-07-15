package com.example.backend.repository;

import com.example.backend.model.UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, Integer> {
    boolean existsByUserIdAndVoucherId(Integer userId, Integer voucherId);
    List<UserVoucher> findByUserIdAndIsUsedFalse(Integer userId);
    Optional<UserVoucher> findByUserIdAndVoucherIdAndIsUsedFalse(Integer userId, Integer voucherId);
}
