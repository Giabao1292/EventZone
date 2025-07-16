package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_seat", indexes = {
        @Index(name = "seat_type_id", columnList = "seat_type_id"),
        @Index(name = "address_id", columnList = "address_id"),
        @Index(name = "seat_zone_id", columnList = "seat_zone_id")
})
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seat_type_id", nullable = false)
    private com.example.backend.model.SeatType seatType;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seat_zone_id", nullable = false)
    private com.example.backend.model.SeatZone seatZone;

    @NotNull
    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @Size(max = 10)
    @NotNull
    @Column(name = "row_label", nullable = false, length = 10)
    private String rowLabel;

    @Column(name = "x")
    private Integer x;

    @Column(name = "y")
    private Integer y;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER,mappedBy = "seat")
    private Set<BookingSeat> tblBookingSeats = new LinkedHashSet<>();

}