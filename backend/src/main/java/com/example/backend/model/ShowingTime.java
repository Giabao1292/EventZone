package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.LinkedHashSet;
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
    private Address address;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @NotNull
    @Column(name = "showing_datetime", nullable = false)
    private Instant showingDatetime;

    @OneToMany(mappedBy = "showingTime")
    private Set<com.example.backend.model.TimeDetail> tblTimeDetails = new LinkedHashSet<>();

}