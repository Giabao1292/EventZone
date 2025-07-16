package com.example.backend.model;

import com.example.backend.util.CheckIn;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JsonBackReference
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @NotNull
    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @ColumnDefault("0.00")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @NotNull
    @Column(name = "final_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Lob
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @NotNull
    @ColumnDefault("'PENDING'")
    @Column(name = "payment_status", nullable = false)
    private String  paymentStatus;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_datetime")
    private LocalDateTime createdDatetime;

    @Column(name = "qr_token")
    private String qrToken;

    /*Không lưu đường dẫn vì như này bảo mật tốt hơn và khi bị lỗ hỏng sql thì sẽ không
    truy vấn ra hình ảnh được bởi vì phân tích qua backend nên hacker không thể biết
    được đường dẫn cụ thể nằm ở folder nào*/
    @Column(name = "qr_publicId")
    private String qrPublicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "checkin_status")
    private CheckIn checkinStatus;

    @Column(name = "checkin_time")
    private Instant checkinTime;

    @OneToMany(
            mappedBy = "booking",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private Set<BookingSeat> tblBookingSeats = new LinkedHashSet<>();
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "showing_time_id", nullable = false)
    @JsonBackReference
    private ShowingTime showingTime;

}