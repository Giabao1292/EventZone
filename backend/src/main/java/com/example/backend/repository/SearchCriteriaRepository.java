package com.example.backend.repository;

import com.example.backend.model.*;
import com.example.backend.repository.criteria.SearchCriteria;
import com.example.backend.repository.criteria.SearchCriteriaBuilder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

        userRoot.fetch("organizer", JoinType.LEFT);
        Fetch<User, UserRole> userRoleFetch = userRoot.fetch("tblUserRoles", JoinType.LEFT);
        userRoleFetch.fetch("role", JoinType.LEFT);
        //Fetch để tránh việc N + 1 xảy ra khi tự động load organizer(EAGER), khi truy cập đến tblUserRoles(Lazy).

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

        organizerRoot.fetch("user", JoinType.LEFT);
        organizerRoot.fetch("orgType", JoinType.LEFT);

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

    public Page<Event> searchEvents(Pageable pageable, String... search){
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Event> criteriaQuery = criteriaBuilder.createQuery(Event.class);
        Root<Event> eventRoot = criteriaQuery.from(Event.class);

        eventRoot.fetch("status", JoinType.LEFT);
        eventRoot.fetch("organizer", JoinType.LEFT);
        eventRoot.fetch("category", JoinType.LEFT);
        Fetch<Event, ShowingTime> fetchShowingTime = eventRoot.fetch("tblShowingTimes", JoinType.LEFT);
        fetchShowingTime.fetch("address", JoinType.LEFT);

        Join<Event, EventStatus> joinStatus = eventRoot.join("status");
        Predicate predicate = getSearchPredicate(List.of(eventRoot, joinStatus), criteriaBuilder, search);
        criteriaQuery.select(eventRoot).where(predicate);
        List<Event> events = entityManager.createQuery(criteriaQuery).setMaxResults(pageable.getPageSize()).setFirstResult((int)pageable.getOffset()).getResultList();
        Long count = countEventsSearch(criteriaBuilder ,search);
        return new PageImpl<>(events, pageable, count);
    }
    public Long countEventsSearch(CriteriaBuilder criteriaBuilder ,String... search){
        log.info("Start count Events search...");
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Event> eventRoot = countQuery.from(Event.class);
        Join<Event, EventStatus> joinStatus = eventRoot.join("status");
        Predicate predicate = getSearchPredicate(List.of(eventRoot, joinStatus), criteriaBuilder, search);
        countQuery.select(criteriaBuilder.count(eventRoot)).where(predicate);
        Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count Events search...");
        return count;
    }

    public Page<Voucher> searchVouchers(Pageable pageable, String... search){
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Voucher> criteriaQuery = criteriaBuilder.createQuery(Voucher.class);
        Root<Voucher> voucherRoot = criteriaQuery.from(Voucher.class);
        Predicate predicate = getSearchPredicate(List.of(voucherRoot), criteriaBuilder, search);
        criteriaQuery.select(voucherRoot).where(predicate);
        List<Voucher> vouchers = entityManager.createQuery(criteriaQuery).setMaxResults(pageable.getPageSize()).setFirstResult((int)pageable.getOffset()).getResultList();
        Long count = countVouchersSearch(criteriaBuilder ,search);
        return new PageImpl<>(vouchers, pageable, count);
    }
    public Long countVouchersSearch(CriteriaBuilder criteriaBuilder ,String... search){
        log.info("Start count Vouchers search...");
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Voucher> voucherRoot = countQuery.from(Voucher.class);
        Predicate predicate = getSearchPredicate(List.of(voucherRoot), criteriaBuilder, search);
        countQuery.select(criteriaBuilder.count(voucherRoot)).where(predicate);
        Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count Vouchers search...");
        return count;
    }

    public Page<Booking> searchAttendees(Pageable pageable, Integer eventId, LocalDateTime startTime, String... search){
        log.info("Start search Attendees search...");
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Booking> criteriaQuery = criteriaBuilder.createQuery(Booking.class);
        Root<Booking> bookingRoot = criteriaQuery.from(Booking.class);
        Fetch<Booking, BookingSeat> seatFetch = bookingRoot.fetch("tblBookingSeats", JoinType.LEFT);
        seatFetch.fetch("seat", JoinType.LEFT);
        seatFetch.fetch("zone", JoinType.LEFT);
        Fetch<Booking, User> userFetch = bookingRoot.fetch("user", JoinType.LEFT);
        userFetch.fetch("tblReviews", JoinType.LEFT);
        userFetch.fetch("organizer", JoinType.LEFT);
        Join<Booking, User> joinUser = bookingRoot.join("user", JoinType.LEFT);
        Join<Booking, ShowingTime> joinShowingTime = bookingRoot.join("showingTime", JoinType.LEFT);
        Join<ShowingTime, Event> joinEvent = joinShowingTime.join("event", JoinType.LEFT);

        Predicate eventPredicate = criteriaBuilder.equal(joinEvent.get("id"), eventId);
        Predicate showingTimePredicate = criteriaBuilder.equal(joinShowingTime.get("startTime"), startTime);
        Predicate predicate = getSearchPredicate(List.of(bookingRoot, joinUser, joinShowingTime, joinEvent), criteriaBuilder, search);
        criteriaQuery.select(bookingRoot).where(criteriaBuilder.and(eventPredicate, showingTimePredicate, predicate));
        List<Booking> bookings = entityManager.createQuery(criteriaQuery).setMaxResults(pageable.getPageSize()).setFirstResult((int)pageable.getOffset()).getResultList();
        Long count = countAttendeesSearch(criteriaBuilder,eventId, startTime ,search);
        log.info("End search Attendees search...");
        return new PageImpl<>(bookings, pageable, count);
    }
    public Long countAttendeesSearch(CriteriaBuilder criteriaBuilder ,int eventId, LocalDateTime startTime, String... search){
        log.info("Start count Attendees search...");
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Booking> bookingRoot = countQuery.from(Booking.class);
        Join<Booking, User> joinUser = bookingRoot.join("user", JoinType.LEFT);
        Join<Booking, ShowingTime> joinShowingTime = bookingRoot.join("showingTime", JoinType.LEFT);
        Join<ShowingTime, Event> joinEvent = joinShowingTime.join("event", JoinType.LEFT);

        Predicate eventPredicate = criteriaBuilder.equal(joinEvent.get("id"), eventId);
        Predicate showingTimePredicate = criteriaBuilder.equal(joinShowingTime.get("startTime"), startTime);
        Predicate predicate = getSearchPredicate(List.of(bookingRoot, joinUser, joinShowingTime, joinEvent), criteriaBuilder, search);

        countQuery.select(criteriaBuilder.count(bookingRoot)).where(criteriaBuilder.and(eventPredicate, showingTimePredicate, predicate));
        Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count Attendees search...");
        return count;
    }
    public List<Event> userSearchEvent(String... search){
        log.info("User start search Event search...");
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Event> criteriaQuery = criteriaBuilder.createQuery(Event.class);
        Root<Event> eventRoot = criteriaQuery.from(Event.class);

        Fetch<Event, ShowingTime> fetchShowingTime = eventRoot.fetch("tblShowingTimes", JoinType.LEFT);
        fetchShowingTime.fetch("address", JoinType.LEFT);

        Join<Event, ShowingTime> joinShowingTime = eventRoot.join("tblShowingTimes", JoinType.LEFT);
        Join<ShowingTime, Address> joinAddress = joinShowingTime.join("address", JoinType.LEFT);
        Join<Event, Category> joinCategory = eventRoot.join("category", JoinType.LEFT);
        Join<ShowingTime, Seat> joinSeat = joinShowingTime.join("seats", JoinType.LEFT);
        Join<ShowingTime, Zone> joinZone = joinShowingTime.join("zones", JoinType.LEFT);

        ArrayList<String> price = new ArrayList<>();
        ArrayList<String> other = new ArrayList<>();
        for(String s : search){
            Pattern pattern = Pattern.compile("^(\\w+)([<>:])(.*)$");
            Matcher matcher = pattern.matcher(s);
            if(matcher.find()){
                if(matcher.group(1).equalsIgnoreCase("price")){
                    price.add(s);
                }
                else{
                    other.add(s);
                }
            }
        }
        Predicate predicate = getSearchPredicate(List.of(eventRoot, joinShowingTime, joinAddress, joinCategory), criteriaBuilder, other.toArray(new String[0]));
        Predicate predicatePriceSeat = getSearchPredicate(List.of(joinSeat), criteriaBuilder, price.toArray(new String[0]));
        Predicate predicatePriceZone = getSearchPredicate(List.of(joinZone), criteriaBuilder, price.toArray(new String[0]));
        criteriaQuery.select(eventRoot).where(criteriaBuilder.and(predicate, criteriaBuilder.or(predicatePriceSeat, predicatePriceZone)));
        log.info("User end search Event search...");
        return entityManager.createQuery(criteriaQuery).getResultList();
    }

//    Lấy sự kiện APPROVED, còn bán vé hoặc chưa kết thúc
    public Page<Event> findActiveEventsForUser(Pageable pageable, String... search) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Event> cq = cb.createQuery(Event.class);
        Root<Event> eventRoot = cq.from(Event.class);

        eventRoot.fetch("status", JoinType.LEFT);
        eventRoot.fetch("category", JoinType.LEFT);
        Fetch<Event, ShowingTime> fetchShowingTime = eventRoot.fetch("tblShowingTimes", JoinType.LEFT);
        fetchShowingTime.fetch("address", JoinType.LEFT);

        Join<Event, EventStatus> joinStatus = eventRoot.join("status");
        Join<Event, ShowingTime> joinShowingTime = eventRoot.join("tblShowingTimes", JoinType.LEFT);

        // Predicate cho SearchCriteria động
        Predicate searchPredicate = getSearchPredicate(List.of(eventRoot, joinStatus), cb, search);

        // Predicate cho trạng thái APPROVED + còn bán vé/chưa kết thúc
        Predicate approved = cb.equal(joinStatus.get("statusName"), "APPROVED");
        LocalDateTime now = LocalDateTime.now();
        Predicate saleOpen = cb.greaterThan(joinShowingTime.get("saleCloseTime"), now);
        Predicate notEnded = cb.greaterThan(joinShowingTime.get("endTime"), now);
        Predicate activeTime = cb.or(saleOpen, notEnded);

        // Ghép predicate tổng hợp
        Predicate finalPredicate = cb.and(searchPredicate, approved, activeTime);

        cq.select(eventRoot).where(finalPredicate).distinct(true);

        List<Event> events = entityManager.createQuery(cq)
                .setFirstResult((int)pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // Đếm tổng số
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Event> countRoot = countQuery.from(Event.class);
        Join<Event, EventStatus> countStatus = countRoot.join("status");
        Join<Event, ShowingTime> countShowing = countRoot.join("tblShowingTimes", JoinType.LEFT);

        Predicate countPredicate = cb.and(
                getSearchPredicate(List.of(countRoot, countStatus), cb, search),
                cb.equal(countStatus.get("statusName"), "APPROVED"),
                cb.or(
                        cb.greaterThan(countShowing.get("saleCloseTime"), now),
                        cb.greaterThan(countShowing.get("endTime"), now)
                )
        );
        countQuery.select(cb.countDistinct(countRoot)).where(countPredicate);
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(events, pageable, total);
    }


//    Sự kiện đã kết thúc toàn bộ (lọc theo category nếu cần)
    public Page<Event> findEndedEventsForReview(Pageable pageable, String... search) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Event> cq = cb.createQuery(Event.class);
        Root<Event> eventRoot = cq.from(Event.class);

        eventRoot.fetch("status", JoinType.LEFT);
        eventRoot.fetch("category", JoinType.LEFT);

        Join<Event, EventStatus> joinStatus = eventRoot.join("status");
        Join<Event, Category> joinCategory = eventRoot.join("category");

        Predicate searchPredicate = getSearchPredicate(List.of(eventRoot, joinStatus, joinCategory), cb, search);

        // Predicate: status APPROVED
        Predicate approved = cb.equal(joinStatus.get("statusName"), "APPROVED");
        LocalDateTime now = LocalDateTime.now();

        // Predicate: NOT EXISTS showing time nào còn chưa kết thúc
        Subquery<Long> sub = cq.subquery(Long.class);
        Root<ShowingTime> subRoot = sub.from(ShowingTime.class);
        sub.select(cb.literal(1L))
                .where(
                        cb.and(
                                cb.equal(subRoot.get("event"), eventRoot),
                                cb.greaterThan(subRoot.get("endTime"), now)
                        )
                );

        Predicate allEnded = cb.not(cb.exists(sub));

        Predicate finalPredicate = cb.and(searchPredicate, approved, allEnded);

        cq.select(eventRoot).where(finalPredicate).distinct(true);

        List<Event> events = entityManager.createQuery(cq)
                .setFirstResult((int)pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // Đếm tổng số
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Event> countRoot = countQuery.from(Event.class);
        Join<Event, EventStatus> countStatus = countRoot.join("status");
        Join<Event, Category> countCategory = countRoot.join("category");
        Predicate countSearchPredicate = getSearchPredicate(List.of(countRoot, countStatus, countCategory), cb, search);

        Subquery<Long> countSub = countQuery.subquery(Long.class);
        Root<ShowingTime> countSubRoot = countSub.from(ShowingTime.class);
        countSub.select(cb.literal(1L))
                .where(
                        cb.and(
                                cb.equal(countSubRoot.get("event"), countRoot),
                                cb.greaterThan(countSubRoot.get("endTime"), now)
                        )
                );
        Predicate countAllEnded = cb.not(cb.exists(countSub));
        Predicate countFinalPredicate = cb.and(countSearchPredicate, cb.equal(countStatus.get("statusName"), "APPROVED"), countAllEnded);

        countQuery.select(cb.countDistinct(countRoot)).where(countFinalPredicate);
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(events, pageable, total);
    }

}
