package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_time_detail", indexes = {
        @Index(name = "showing_time_id", columnList = "showing_time_id")
})
public class TimeDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "time_detail_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "showing_time_id", nullable = false)
    private ShowingTime showingTime;

    @NotNull
    @Column(name = "time_detail", nullable = false)
    private LocalTime timeDetail;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER,mappedBy = "timeDetail")
    private Set<Booking> tblBookings = new LinkedHashSet<>();

}