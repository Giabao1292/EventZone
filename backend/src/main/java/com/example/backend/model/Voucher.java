package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_voucher", uniqueConstraints = {
        @UniqueConstraint(name = "voucher_code", columnNames = {"voucher_code"})
})
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "voucher_code", nullable = false, length = 50)
    private String voucherCode;

    @Size(max = 100)
    @NotNull
    @Column(name = "voucher_name", nullable = false, length = 100)
    private String voucherName;

    @Lob
    @Column(name = "description")
    private String description;

    @ColumnDefault("0")
    @Column(name = "required_points")
    private Integer requiredPoints;

    @NotNull
    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @NotNull
    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @NotNull
    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER,mappedBy = "voucher")
    private Set<Booking> tblBookings = new LinkedHashSet<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER,mappedBy = "voucher")
    private Set<EventVoucher> tblEventVouchers = new LinkedHashSet<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER,mappedBy = "voucher")
    private Set<UserVoucher> tblUserVouchers = new LinkedHashSet<>();

}