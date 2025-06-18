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
@Table(name = "tbl_org_type", uniqueConstraints = {
        @UniqueConstraint(name = "type_code", columnNames = {"type_code"})
})
public class OrgType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "org_type_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "type_code", nullable = false, length = 50)
    private String typeCode;

    @Size(max = 100)
    @NotNull
    @Column(name = "type_name", nullable = false, length = 100)
    private String typeName;

    @OneToMany(mappedBy = "orgType")
    private Set<Organizer> tblOrganizers = new LinkedHashSet<>();

}