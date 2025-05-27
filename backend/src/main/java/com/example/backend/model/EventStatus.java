package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tbl_event_status", uniqueConstraints = {
        @UniqueConstraint(name = "status_name", columnNames = {"status_name"})
})
public class EventStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "status_name", nullable = false, length = 50)
    private String statusName;

}