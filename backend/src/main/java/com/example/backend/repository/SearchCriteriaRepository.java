package com.example.backend.repository;

import com.example.backend.dto.response.OrganizerResponse;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.model.*;
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
        Predicate predicate = getSearchPredicate(List.of(userRoot, joinRole), criteriaBuilder, search);
        criteriaQuery.select(userRoot).where(predicate);
        List<User> listUsers = entityManager.createQuery(criteriaQuery)
                .setFirstResult((int)pageable.getOffset()).setMaxResults(pageable.getPageSize()).getResultList();
        Long count = countUsersSearch(criteriaBuilder,search);
        log.info("End Search Users...");
        return new PageImpl<>(listUsers, pageable, count);
    }
    public Long countUsersSearch(CriteriaBuilder criteriaBuilder ,String... search){
        log.info("Start count users search...");
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<User> userRoot = countQuery.from(User.class);
        Join<User, UserRole> joinUserRole = userRoot.join("tblUserRoles");
        Join<UserRole, Role> joinRole = joinUserRole.join("role");
        Predicate predicate = getSearchPredicate(List.of(userRoot, joinRole), criteriaBuilder, search);
        countQuery.select(criteriaBuilder.count(userRoot)).where(predicate);
        Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count users search...");
        return count;
    }
    public Page<Organizer> searchOrganizers(Pageable pageable, String... search){
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Organizer> criteriaQuery = criteriaBuilder.createQuery(Organizer.class);
        Root<Organizer> organizerRoot = criteriaQuery.from(Organizer.class);
        Join<Organizer, User> joinUser = organizerRoot.join("user");
        Join<Organizer, OrgType> joinOrgType = organizerRoot.join("orgType");
        Predicate predicate = getSearchPredicate(List.of(organizerRoot,joinUser, joinOrgType), criteriaBuilder, search);
        criteriaQuery.select(organizerRoot).where(predicate);
        List<Organizer> organizers = entityManager.createQuery(criteriaQuery).setMaxResults(pageable.getPageSize()).setFirstResult((int)pageable.getOffset()).getResultList();
        Long count = countOrganizerSearch(criteriaBuilder ,search);
        return new PageImpl<>(organizers, pageable, count);
    }
    public Long countOrganizerSearch(CriteriaBuilder criteriaBuilder ,String... search){
        log.info("Start count organizer search...");
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Organizer> organizerRoot = countQuery.from(Organizer.class);
        Join<Organizer, User> joinUserRole = organizerRoot.join("user");
        Join<Organizer, OrgType> joinOrgType = organizerRoot.join("orgType");
        Predicate predicate = getSearchPredicate(List.of(organizerRoot, joinUserRole, joinOrgType), criteriaBuilder, search);
        countQuery.select(criteriaBuilder.count(organizerRoot)).where(predicate);
         Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count users search...");
        return count;
    }
    private Predicate getSearchPredicate(List<From<?,?>> from, CriteriaBuilder criteriaBuilder, String... search){
        Predicate predicate = criteriaBuilder.conjunction();
        List<SearchCriteria> searchCriteriaList = new ArrayList<>();
        for(String searchStr : search){
            Pattern pattern = Pattern.compile("^(\\w+)([:<>])(.*)$");
            Matcher matcher = pattern.matcher(searchStr);
            if(matcher.find()){
                searchCriteriaList.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
            }
        }
        SearchCriteriaBuilder searchCriteriaBuilder = new SearchCriteriaBuilder(criteriaBuilder, predicate, from);
        searchCriteriaList.forEach(searchCriteriaBuilder);
        return searchCriteriaBuilder.getPredicate();
    }

}
