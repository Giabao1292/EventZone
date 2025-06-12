package com.example.backend.repository;

import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.model.User;
import com.example.backend.repository.criteria.SearchCriteria;
import com.example.backend.repository.criteria.SearchCriteriaBuilder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Repository
public class SearchCriteriaRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public Page<User> searchUsers(Pageable pageable, String... search){
        CriteriaBuilder criteriaBuilder =  entityManager.getCriteriaBuilder();
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
        Root<User> userRoot = criteriaQuery.from(User.class);
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
        SearchCriteriaBuilder searchCriteriaBuilder = new SearchCriteriaBuilder(criteriaBuilder, predicate, userRoot);
        searchCriteriaList.forEach(searchCriteriaBuilder);
        predicate = searchCriteriaBuilder.getPredicate();
        criteriaQuery.where(predicate);
        List<User> listUsers = entityManager.createQuery(criteriaQuery)
                .setFirstResult((int)pageable.getOffset()).setMaxResults(pageable.getPageSize()).getResultList();
        Long count = countUsersSearch(searchCriteriaList);
        return new PageImpl<>(listUsers, pageable, count);
    }
    public Long countUsersSearch(List<SearchCriteria> searchCriteriaList){
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<User> countRoot = countQuery.from(User.class);
        Predicate predicate = criteriaBuilder.conjunction();

        SearchCriteriaBuilder searchCriteriaBuilder = new SearchCriteriaBuilder(criteriaBuilder, predicate, countRoot);
        searchCriteriaList.forEach(searchCriteriaBuilder);
        predicate = searchCriteriaBuilder.getPredicate();

        countQuery.select(criteriaBuilder.count(countRoot)).where(predicate);
        Long count = entityManager.createQuery(countQuery).getSingleResult();

        return count;

    }
}
