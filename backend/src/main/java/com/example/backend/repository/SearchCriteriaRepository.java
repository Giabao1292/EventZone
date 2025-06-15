package com.example.backend.repository;

import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import com.example.backend.repository.criteria.SearchCriteria;
import com.example.backend.repository.criteria.SearchCriteriaBuilder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.JoinTable;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Repository
public class SearchCriteriaRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public Page<User> searchUsers(Pageable pageable, String... search){
        log.info("Start Search Users...");
        CriteriaBuilder criteriaBuilder =  entityManager.getCriteriaBuilder();
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
        Root<User> userRoot = criteriaQuery.from(User.class);
        Join<User, UserRole> joinUserRole = userRoot.join("tblUserRoles", JoinType.LEFT);
        Join<UserRole, Role> joinRole = joinUserRole.join("role", JoinType.LEFT);
        Predicate predicate = criteriaBuilder.conjunction();
        List<SearchCriteria> searchCriteriaList = new ArrayList<>();
        for(String searchStr : search){
            //Mỗi nhóm sẽ có 3 nhóm, 1 là key, 2 là dau so sanh, 3 là value
            Pattern pattern = Pattern.compile("^(\\w+?)([:<>])(.*)$");
            Matcher matcher = pattern.matcher(searchStr);
            if(matcher.find()){
                searchCriteriaList.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
            }
        }
        //Build query
        SearchCriteriaBuilder searchCriteriaBuilder = new SearchCriteriaBuilder(criteriaBuilder, predicate, List.of(userRoot, joinRole));
        searchCriteriaList.forEach(searchCriteriaBuilder);
        predicate = searchCriteriaBuilder.getPredicate();
        criteriaQuery.select(userRoot).where(predicate);
        List<User> listUsers = entityManager.createQuery(criteriaQuery)
                .setFirstResult((int)pageable.getOffset()).setMaxResults(pageable.getPageSize()).getResultList();
        Long count = countUsersSearch(searchCriteriaList);
        log.info("End Search Users...");
        return new PageImpl<>(listUsers, pageable, count);
    }
    public Long countUsersSearch(List<SearchCriteria> searchCriteriaList){
        log.info("Start count users search...");
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<User> userRoot = countQuery.from(User.class);
        Join<User, UserRole> joinUserRole = userRoot.join("tblUserRoles");
        Join<UserRole, Role> joinRole = joinUserRole.join("role");
        Predicate predicate = criteriaBuilder.conjunction();
        SearchCriteriaBuilder searchCriteriaBuilder = new SearchCriteriaBuilder(criteriaBuilder, predicate, List.of(userRoot, joinRole));
        searchCriteriaList.forEach(searchCriteriaBuilder);
        predicate = searchCriteriaBuilder.getPredicate();
        countQuery.select(criteriaBuilder.count(userRoot)).where(predicate);
        Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count users search...");
        return count;
    }
}
