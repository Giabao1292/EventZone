package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_booking", indexes = {
        @Index(name = "user_id", columnList = "user_id"),
        @Index(name = "time_detail_id", columnList = "time_detail_id"),
        @Index(name = "voucher_id", columnList = "voucher_id")
})
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "time_detail_id", nullable = false)
    private com.example.backend.model.TimeDetail timeDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private com.example.backend.model.Voucher voucher;

    @NotNull
    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @ColumnDefault("0.00")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @NotNull
    @Column(name = "final_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @NotNull
    @Lob
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @NotNull
    @ColumnDefault("'pending'")
    @Lob
    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;

    @Column(name = "paid_at")
    private Instant paidAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_datetime")
    private Instant createdDatetime;

    @Lob
    @Column(name = "qr_code_data")
    private String qrCodeData;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER,mappedBy = "booking")
    private Set<com.example.backend.model.BookingSeat> tblBookingSeats = new LinkedHashSet<>();

}