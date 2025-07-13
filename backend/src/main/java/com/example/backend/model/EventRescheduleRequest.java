    package com.example.backend.model;

    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotNull;
    import lombok.*;
    import java.time.LocalDateTime;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Entity
    @Table(name = "tbl_event_reschedule_request")
    public class EventRescheduleRequest {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "reschedule_request_id")
        private Integer id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "event_id", nullable = false)
        private Event event;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "showing_time_id", nullable = false)
        private ShowingTime showingTime;

        @Column(name = "old_start_time", nullable = false)
        private LocalDateTime oldStartTime;

        @Column(name = "old_end_time", nullable = false)
        private LocalDateTime oldEndTime;

        @Column(name = "requested_start_time", nullable = false)
        private LocalDateTime requestedStartTime;

        @Column(name = "requested_end_time", nullable = false)
        private LocalDateTime requestedEndTime;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "requested_by_user_id", nullable = false)
        private User requestedBy; // Người gửi yêu cầu (Organizer)

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "approved_by_user_id")
        private User approvedBy; // Admin duyệt (có thể null nếu chưa duyệt)

        @Column(name = "reason", columnDefinition = "TEXT")
        private String reason; // Lý do xin dời (organizer nhập)

        @Column(name = "admin_note", columnDefinition = "TEXT")
        private String adminNote; // Lý do từ chối hoặc ghi chú của admin

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "status_id", nullable = false)
        private EventStatus status; // PENDING, APPROVED, REJECTED

        @Column(name = "requested_at", nullable = false)
        private LocalDateTime requestedAt;

        @Column(name = "responded_at")
        private LocalDateTime respondedAt;
    }
