package com.example.backend.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_event_view")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer eventViewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

}
