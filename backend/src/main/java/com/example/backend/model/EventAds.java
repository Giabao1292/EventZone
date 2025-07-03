package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_event_ads")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventAds {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // --- Quan hệ với bảng sự kiện ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", referencedColumnName = "event_id", nullable = false)
    private Event event;

    // --- Quan hệ với bảng organizer ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", referencedColumnName = "organizer_id", nullable = false)
    private Organizer organizer;

    // --- Thời gian yêu cầu quảng cáo ---
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    // --- Thanh toán ---
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_gateway")
    private PaymentGateway paymentGateway;

    @Column(name = "payment_transaction_id", nullable = false)
    private String paymentTransactionId;

    // --- Trạng thái phê duyệt ---
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AdsStatus status;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    // --- Refund ---
    @Enumerated(EnumType.STRING)
    @Column(name = "refund_status")
    private RefundStatus refundStatus;

    @Column(name = "refund_at")
    private LocalDateTime refundAt;

    // --- Banner riêng nếu có ---
    @Column(name = "banner_image_url")
    private String bannerImageUrl;

    // --- Tự động cập nhật thời gian ---
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Enum ---
    public enum AdsStatus {
        PENDING, APPROVED, REJECTED
    }

    public enum PaymentGateway {
        PAYOS, VNPAY
    }

    public enum RefundStatus {
        NONE, REFUNDED, FAILED
    }
}
