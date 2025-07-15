package com.example.backend.repository;

import com.example.backend.model.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    Optional<Voucher> findByVoucherCode(String voucherCode);

    boolean existsByVoucherCode(String voucherCode);

    Page<Voucher> findAll(Pageable pageable);
    @Query("""
    SELECT v FROM Voucher v
    WHERE v.status = 1
      AND v.validUntil >= :today
      AND v.requiredPoints <= :score
      AND v.id NOT IN (
         SELECT uv.voucher.id FROM UserVoucher uv WHERE uv.user.id = :userId
      )
""")
    List<Voucher> findAvailableToRedeem(@Param("userId") Integer userId,
                                        @Param("score") Integer score,
                                        @Param("today") LocalDate today);

}
