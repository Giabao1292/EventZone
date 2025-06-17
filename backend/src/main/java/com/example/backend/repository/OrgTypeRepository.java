package com.example.backend.repository;

import com.example.backend.model.OrgType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrgTypeRepository extends JpaRepository<OrgType, Integer> {
    Optional<OrgType> findByTypeCode(String typeCode);
    Optional<OrgType> findByTypeName(String typeName);
}
