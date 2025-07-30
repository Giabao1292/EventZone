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
        criteriaQuery.select(eventRoot).where(predicate).orderBy(criteriaBuilder.desc(eventRoot.get("createdAt")));
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

    public Page<Booking> searchBooking(Pageable pageable, String[] search){
        log.info("Start search Booking ...");
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Booking> criteriaQuery = criteriaBuilder.createQuery(Booking.class);
        Root<Booking> bookingRoot = criteriaQuery.from(Booking.class);
        bookingRoot.fetch("user", JoinType.LEFT);
        bookingRoot.fetch("tblBookingSeats", JoinType.LEFT);
        Fetch<Booking, ShowingTime> showingTimeFetch = bookingRoot.fetch("showingTime", JoinType.LEFT);
        showingTimeFetch.fetch("event", JoinType.LEFT);
        Join<Booking, User> joinUser = bookingRoot.join("user", JoinType.LEFT);
        Join<User, Organizer> joinOrganizer = joinUser.join("organizer", JoinType.LEFT);
        Join<Booking, ShowingTime> joinShowingTime = bookingRoot.join("showingTime", JoinType.LEFT);
        Join<ShowingTime, Event> joinEvent = joinShowingTime.join("event", JoinType.LEFT);
        Predicate predicate = getSearchPredicate(List.of(bookingRoot, joinUser, joinOrganizer, joinShowingTime, joinEvent), criteriaBuilder, search);
        criteriaQuery.select(bookingRoot).where(predicate).orderBy(criteriaBuilder.desc(bookingRoot.get("paidAt")));
        List<Booking> bookings = entityManager.createQuery(criteriaQuery).setMaxResults(pageable.getPageSize()).setFirstResult((int)pageable.getOffset()).getResultList();
        Long count = countBookingSearch(criteriaBuilder,search);
        log.info("End search Booking...");
        return new PageImpl<>(bookings, pageable, count);
    }
    public Long countBookingSearch(CriteriaBuilder criteriaBuilder, String... search){
        log.info("Start count Booking seach...");
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Booking> bookingRoot = countQuery.from(Booking.class);
        Join<Booking, User> joinUser = bookingRoot.join("user", JoinType.LEFT);
        Join<User, Organizer> joinOrganizer = joinUser.join("organizer", JoinType.LEFT);
        Join<Booking, ShowingTime> joinShowingTime = bookingRoot.join("showingTime", JoinType.LEFT);
        Join<ShowingTime, Event> joinEvent = joinShowingTime.join("event", JoinType.LEFT);
        Predicate predicate = getSearchPredicate(List.of(bookingRoot, joinUser, joinOrganizer , joinShowingTime, joinEvent), criteriaBuilder, search);
        countQuery.select(criteriaBuilder.count(bookingRoot)).where(predicate);
        Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count Booking search...");
        return count;
    }
    public Page<EventAds> searchEventAds(Pageable pageable, String[] search){
        log.info("Start search EventAds ...");
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<EventAds> criteriaQuery = criteriaBuilder.createQuery(EventAds.class);
        Root<EventAds> eventAdsRoot = criteriaQuery.from(EventAds.class);
        eventAdsRoot.fetch("organizer", JoinType.LEFT);
        eventAdsRoot.fetch("event", JoinType.LEFT);
        Join<EventAds, Event> joinEvent = eventAdsRoot.join("event", JoinType.LEFT);
        Join<EventAds, Organizer> joinOrganizer = eventAdsRoot.join("organizer", JoinType.LEFT);
        Predicate predicate = getSearchPredicate(List.of(eventAdsRoot, joinEvent, joinOrganizer), criteriaBuilder, search);
        criteriaQuery.select(eventAdsRoot).where(predicate).orderBy(criteriaBuilder.desc(eventAdsRoot.get("createdAt")));
        List<EventAds> bookings = entityManager.createQuery(criteriaQuery).setMaxResults(pageable.getPageSize()).setFirstResult((int)pageable.getOffset()).getResultList();
        Long count = countEventAdsSearch(criteriaBuilder,search);
        log.info("End search EventAds...");
        return new PageImpl<>(bookings, pageable, count);
    }
    public Long countEventAdsSearch(CriteriaBuilder criteriaBuilder, String... search){
        log.info("Start count EventAds search...");
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<EventAds> eventAdsRoot = countQuery.from(EventAds.class);
        Join<EventAds, Organizer> joinOrganizer = eventAdsRoot.join("organizer", JoinType.LEFT);
        Join<EventAds, Event> joinEvent = eventAdsRoot.join("event", JoinType.LEFT);
        Predicate predicate = getSearchPredicate(List.of(eventAdsRoot, joinOrganizer, joinEvent), criteriaBuilder, search);
        countQuery.select(criteriaBuilder.count(eventAdsRoot)).where(predicate);
        Long count = entityManager.createQuery(countQuery).getSingleResult();
        log.info("End count EventAds search...");
        return count;
    }
}
