package com.example.backend.repository.criteria;

import com.example.backend.exception.ResourceNotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import lombok.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.function.Consumer;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchCriteriaBuilder<T> implements Consumer<SearchCriteria> {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private CriteriaBuilder criteriaBuilder;
    private Predicate predicate;
    private List<From<?, ?>> joinList;

    @Override
    public void accept(SearchCriteria criteria) {
        String key = criteria.getKey();
        Object value = criteria.getValue();
        String op = criteria.getOperation();

        Path<?> path = getField(key);
        Class<?> type = path.getJavaType();

        if ("<".equals(op)) {
            predicate = criteriaBuilder.and(predicate, buildLessThan(path, type, value));
        } else if (">".equals(op)) {
            predicate = criteriaBuilder.and(predicate, buildGreaterThan(path, type, value));
        } else {
            predicate = criteriaBuilder.and(predicate, buildEqualsOrLike(path, type, value));
        }
    }

    private Predicate buildLessThan(Path<?> path, Class<?> type, Object value) {
        if (type.equals(LocalDate.class)) {
            return criteriaBuilder.lessThan(cast(path), LocalDate.parse(value.toString().trim(), DATE_FORMATTER));
        }
        return criteriaBuilder.lessThan(cast(path), value.toString());
    }

    private Predicate buildGreaterThan(Path<?> path, Class<?> type, Object value) {
        if (type.equals(LocalDate.class)) {
            return criteriaBuilder.greaterThan(cast(path), LocalDate.parse(value.toString().trim(), DATE_FORMATTER));
        }
        return criteriaBuilder.greaterThan(cast(path), value.toString());
    }

    private Predicate buildEqualsOrLike(Path<?> path, Class<?> type, Object value) {
        if (type.equals(String.class)) {
            return criteriaBuilder.like(cast(path), "%" + value + "%");
        } else if (type.equals(LocalDate.class)) {
            return criteriaBuilder.equal(cast(path), LocalDate.parse(value.toString(), DATE_FORMATTER));
        }
        return criteriaBuilder.equal(path, value);
    }

    private <Y> Path<Y> cast(Path<?> path) {
        return (Path<Y>) path;
    }

    public Path<?> getField(String key) {
        for (From<?, ?> join : joinList) {
            try {
                return join.get(key);
            } catch (IllegalArgumentException ignored) {
            }
        }
        throw new ResourceNotFoundException("Field '" + key + "' not found");
    }
}
