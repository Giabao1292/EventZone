package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import java.util.List;
import java.util.ArrayList;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;



@Getter
@Setter
@Entity
@Table(name = "tbl_review", indexes = {
        @Index(name = "event_id", columnList = "event_id"),
        @Index(name = "user_id", columnList = "user_id")
})
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Lob
    @Column(name = "comment")
    private String comment;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "ENUM('active','deleted') DEFAULT 'active'")
    private ReviewStatus status = ReviewStatus.active;

    @ManyToOne
    @JoinColumn(name = "showing_time_id", nullable = false)
    private ShowingTime showingTime;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewReply> replies = new ArrayList<>();


}