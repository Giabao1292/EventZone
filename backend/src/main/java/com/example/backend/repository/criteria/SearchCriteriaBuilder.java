package com.example.backend.repository.criteria;

import com.example.backend.model.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.function.Consumer;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchCriteriaBuilder implements Consumer<SearchCriteria> {
    private CriteriaBuilder criteriaBuilder;
    private Predicate predicate;
    private Root<User> root;
    @Override
    public void accept(SearchCriteria searchCriteria) {
        String key = searchCriteria.getKey();
        Object value = searchCriteria.getValue();
        String operator = searchCriteria.getOperation();
        Class<?> fieldType = root.get(key).getJavaType();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        if (operator.equals("<")) {
            if (fieldType.equals(LocalDate.class)) {
                LocalDate dateValue = LocalDate.parse(value.toString().trim(), formatter);
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThan(root.get(key), dateValue));
            } else {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThan(root.get(key), value.toString()));
            }
        } else if (operator.equals(">")) {
            if (fieldType.equals(LocalDate.class)) {
                LocalDate dateValue = LocalDate.parse(value.toString().trim(), formatter);
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThan(root.get(key), dateValue));
            } else {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThan(root.get(key), value.toString()));
            }
        } else {
            if (fieldType.equals(String.class)) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(root.get(key), "%" + value.toString() + "%"));
            } else if (fieldType.equals(LocalDate.class)) {
                LocalDate dateValue = LocalDate.parse(value.toString(), formatter);
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get(key), dateValue));
            } else {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get(key), value));
            }
        }
    }
}
