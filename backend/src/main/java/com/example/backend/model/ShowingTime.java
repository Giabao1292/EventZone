package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_showing_time", indexes = {
        @Index(name = "address_id", columnList = "address_id"),
        @Index(name = "event_id", columnList = "event_id")
})
public class ShowingTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showing_time_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "address_id", nullable = false)
    @JsonBackReference
    private Address address;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonBackReference
    private Event event;

    // Chuyển từ Instant sang LocalDateTime
    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @NotNull
    @Column(name = "sale_open_time", nullable = false)
    private LocalDateTime saleOpenTime;

    @NotNull
    @Column(name = "sale_close_time", nullable = false)
    private LocalDateTime saleCloseTime;

    @NotNull
    @Column(name = "layout_mode", nullable = false)
    private String layoutMode;

    @OneToMany(mappedBy = "showingTime", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Seat> seats = new HashSet<>();

    @OneToMany(mappedBy = "showingTime", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Zone> zones = new HashSet<>();

    @OneToMany(mappedBy = "showingTime", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Booking> bookings = new HashSet<>();


}
