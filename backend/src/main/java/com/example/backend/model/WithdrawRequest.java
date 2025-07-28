package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_withdraw_request")
@Data
public class WithdrawRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private Organizer organizer;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @JsonBackReference
    private Event event;

    @ManyToOne
    @JoinColumn(name = "showing_time_id", nullable = false)
    @JsonBackReference
    private ShowingTime showingTime;

    @Column(nullable = false)
    private BigDecimal amount;

    // Thông tin ngân hàng
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private UserBankAccount userBankAccount;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "processed_at")
    private LocalDateTime processedAt;
}
