
package com.example.backend.service.impl;

import com.example.backend.dto.projection.EventMinPriceProjection;
import com.example.backend.dto.request.EventHomeDTO;
import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.request.ShowingTimeRequest;
import com.example.backend.dto.request.UpdateStatusEvent;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.EventService;
import com.example.backend.util.StatusOrganizer;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    private final OrganizerRepository organizerRepository;

    private final EventStatusRepository eventStatusRepository;

    private final SearchCriteriaRepository searchCriteriaRepository;

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final EventViewRepository eventViewRepository;

    private final RestTemplate restTemplate;

    @Override
    public List<EventResponse> getPosterImagesByCategory(int categoryId) {
        LocalDateTime now = LocalDateTime.now();
        List<Event> events = eventRepository.findByCategory_CategoryIdAndStatus_StatusName(categoryId, "APPROVED");
        // LỌC: Chỉ lấy event còn ít nhất 1 suất chiếu chưa kết thúc
        List<Event> filtered = events.stream()
                .filter(ev ->
                        ev.getTblShowingTimes() != null &&
                                ev.getTblShowingTimes().stream().anyMatch(
                                        st -> st.getEndTime() != null && st.getEndTime().isAfter(now)
                                )
                )
                .collect(Collectors.toList());

        return filtered.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<Event> getApprovedEvents() {
        return eventRepository.findByStatus_StatusName("APPROVED");
    }


    @Override
    public Map<String, List<EventHomeDTO>> getHomeEventsGroupedByStatus() {
        List<Event> events = getApprovedEvents();
        List<EventHomeDTO> ongoingEvents = new ArrayList<>();
        List<EventHomeDTO> upcomingEvents = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Event event : events) {
            Set<ShowingTime> showings = event.getTblShowingTimes();
            if (showings == null || showings.isEmpty()) continue;

            boolean hasOngoing = false;
            boolean hasUpcoming = false;

            // Check all showings to determine status
            for (ShowingTime st : showings) {
                if (st.getSaleOpenTime() != null && st.getSaleCloseTime() != null) {
                    if (!now.isBefore(st.getSaleOpenTime()) && !now.isAfter(st.getSaleCloseTime())) {
                        hasOngoing = true; // Mark as ongoing if any showing is open
                    } else if (now.isBefore(st.getSaleOpenTime())) {
                        hasUpcoming = true; // Mark as upcoming if any showing is upcoming
                    }
                }
            }

            // Skip if neither ongoing nor upcoming
            if (!hasOngoing && !hasUpcoming) continue;

            // Calculate lowest price
            OptionalDouble lowestPriceOpt = showings.stream()
                    .flatMap(st -> {
                        Stream<BigDecimal> seatPrices = st.getSeats() != null
                                ? st.getSeats().stream().map(Seat::getPrice)
                                : Stream.empty();
                        Stream<BigDecimal> zonePrices = st.getZones() != null
                                ? st.getZones().stream().map(Zone::getPrice)
                                : Stream.empty();
                        return Stream.concat(seatPrices, zonePrices);
                    })
                    .mapToDouble(BigDecimal::doubleValue)
                    .min();

            double lowestPrice = lowestPriceOpt.orElse(0);
            EventHomeDTO dto = new EventHomeDTO(event, lowestPrice);
            // Prioritize ongoing status
            if (hasOngoing) {
                ongoingEvents.add(dto);
            } else {
                upcomingEvents.add(dto);
            }
        }

        Map<String, List<EventHomeDTO>> result = new HashMap<>();
        result.put("ongoing", ongoingEvents);
        result.put("upcoming", upcomingEvents);
        return result;
    }

    @Override
    public List<EventHomeDTO> recommendEvents(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        Integer userId = user.getId();
        String url = "http://localhost:5000/recommend?user_id=" + userId;
        Map<String, List<Integer>> response = restTemplate.getForObject(url, Map.class);
        List<Integer> recommendedEventIds = response.get("recommendations");

        if (recommendedEventIds == null || recommendedEventIds.isEmpty()) {
            return Collections.emptyList();
        }

        LocalDateTime now = LocalDateTime.now();
        List<EventHomeDTO> result = new ArrayList<>();

        for (Integer eventId : recommendedEventIds) {
            Optional<Event> optionalEvent = eventRepository.findById(eventId);
            if (optionalEvent.isEmpty()) continue;

            Event event = optionalEvent.get();

            Set<ShowingTime> showings = event.getTblShowingTimes();
            if (showings == null || showings.isEmpty()) continue;

            boolean hasValidShowing = false;
            for (ShowingTime st : showings) {
                if (st.getSaleOpenTime() != null && st.getSaleCloseTime() != null &&
                        (now.isBefore(st.getSaleCloseTime()))) {
                    hasValidShowing = true;
                    break;
                }
            }

            if (!hasValidShowing) continue;

            // Tính giá thấp nhất
            OptionalDouble lowestPriceOpt = showings.stream()
                    .flatMap(st -> st.getSeats().stream())
                    .mapToDouble(seat -> seat.getPrice().doubleValue())
                    .min();

            double lowestPrice = lowestPriceOpt.orElse(0);
            EventHomeDTO dto = new EventHomeDTO(event, lowestPrice);
            result.add(dto);
        }

        return result;
    }

    @Override
    public Event createEvent(EventRequest request) {
        Organizer organizer = organizerRepository.findById(request.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Organizer"));

        Category category = new Category();
        category.setCategoryId(request.getCategoryId());

        Event event = new Event();
        event.setOrganizer(organizer);
        event.setCategory(category);
        event.setEventTitle(request.getEventTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        EventStatus submittedStatus = eventStatusRepository.findByStatusName("DRAFT")
                .orElseThrow(() -> new RuntimeException("Status not found"));
        event.setStatus(submittedStatus);
        event.setAgeRating(request.getAgeRating());
        event.setBannerText(request.getBannerText());
        event.setHeaderImage(request.getHeaderImage());
        event.setPosterImage(request.getPosterImage());
        event.setCreatedBy("system");
        event.setModifiedBy("system");

        return eventRepository.save(event);
    }

    @Override
    public Event submitEvent(int eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        EventStatus submittedStatus = eventStatusRepository.findByStatusName("PENDING")
                .orElseThrow(() -> new RuntimeException("Status not found"));
        event.setStatus(submittedStatus);
        return eventRepository.save(event);
    }


    @Override
    @Transactional
    public EventDetailDTO getEventDetailById(int eventId, String userEmail) {
        Event event = eventRepository.findEventDetail(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện với ID = " + eventId));

        // ✅ Ghi nhận lượt xem nếu có email
        if (userEmail != null && !userEmail.isBlank()) {
            try {
                Optional<User> user = userRepository.findByEmail(userEmail);
                if (user.isPresent()) {
                    EventView view = EventView.builder()
                            .event(event)
                            .user(user.get())
                            .build();
                    eventViewRepository.save(view);
                }
            } catch (Exception e) {
                e.printStackTrace(); // Không crash hệ thống
            }
        }

        // Mapping danh sách ShowingTime
        List<ShowingTimeDTO> showingTimeDTOs = event.getTblShowingTimes().stream().map(st -> {
            ShowingTimeDTO stDto = new ShowingTimeDTO();
            stDto.setId(st.getId());
            stDto.setStartTime(st.getStartTime());
            stDto.setEndTime(st.getEndTime());
            stDto.setLayoutMode(st.getLayoutMode());
            stDto.setSaleOpenTime(st.getSaleOpenTime());
            stDto.setSaleCloseTime(st.getSaleCloseTime());


            // Thêm dòng này để trả về status cho FE!
            stDto.setStatus(st.getStatus() != null ? st.getStatus().name() : null);

            // Mapping Address (nếu có)
            Address address = st.getAddress();
            if (address != null) {
                AddressDTO addrDto = new AddressDTO();
                addrDto.setId(address.getId());
                addrDto.setVenueName(address.getVenueName());
                addrDto.setLocation(address.getLocation());
                addrDto.setCity(address.getCity());
                stDto.setAddress(addrDto);
            }

            // Mapping Seats
            if (st.getSeats() != null) {
                List<SeatDTO> seatDTOs = st.getSeats().stream().map(seat -> {
                    SeatDTO seatDTO = new SeatDTO();
                    seatDTO.setId(seat.getId());
                    seatDTO.setSeatLabel(seat.getSeatLabel());
                    seatDTO.setType(seat.getType());
                    seatDTO.setPrice(seat.getPrice());
                    seatDTO.setX(seat.getX());
                    seatDTO.setY(seat.getY());
                    seatDTO.setAvailable(seat.getBookingSeats() == null || seat.getBookingSeats().isEmpty());
                    return seatDTO;
                }).collect(Collectors.toList());
                stDto.setSeats(seatDTOs);
            }

            // Mapping Zones
            if (st.getZones() != null) {
                List<ZoneDTO> zoneDTOs = st.getZones().stream().map(zone -> {
                    ZoneDTO zoneDTO = new ZoneDTO();
                    zoneDTO.setId(zone.getId());
                    zoneDTO.setZoneName(zone.getZoneName());
                    zoneDTO.setType(zone.getType());
                    zoneDTO.setPrice(zone.getPrice());
                    zoneDTO.setX(zone.getX());
                    zoneDTO.setY(zone.getY());
                    zoneDTO.setWidth(zone.getWidth());
                    zoneDTO.setHeight(zone.getHeight());
                    zoneDTO.setCapacity(zone.getCapacity());
                    zoneDTO.setAvailable(zone.getBookingSeats() == null || zone.getBookingSeats().size() < zone.getCapacity());
                    return zoneDTO;
                }).collect(Collectors.toList());
                stDto.setZones(zoneDTOs);
            }

            return stDto;
        }).collect(Collectors.toList());

        // Lấy thông tin địa điểm tổng hợp từ suất chiếu đầu tiên
        String location = null;
        String city = null;
        String venueName = null;
        if (!event.getTblShowingTimes().isEmpty()) {
            ShowingTime firstST = event.getTblShowingTimes().iterator().next();
            if (firstST.getAddress() != null) {
                location = firstST.getAddress().getLocation();
                city = firstST.getAddress().getCity();
                venueName = firstST.getAddress().getVenueName();
            }
        }

        // Mapping vào DTO
        EventDetailDTO dto = new EventDetailDTO();
        dto.setId(event.getId());
        dto.setEventTitle(event.getEventTitle());
        dto.setDescription(event.getDescription());
        dto.setCategoryId(event.getCategory() != null ? event.getCategory().getCategoryId() : null);
        dto.setBannerText(event.getBannerText());
        dto.setHeaderImage(event.getHeaderImage());
        dto.setPosterImage(event.getPosterImage());
        dto.setAgeRating(event.getAgeRating());
        dto.setLocation(location);
        dto.setCity(city);
        dto.setVenueName(venueName);
        dto.setMaxCapacity(null);

        dto.setStartTime(event.getStartTime() != null ? event.getStartTime().toString() : null);
        dto.setEndTime(event.getEndTime() != null ? event.getEndTime().toString() : null);
        dto.setStatusId(event.getStatus() != null ? event.getStatus().getId() : null);
        dto.setShowingTimes(showingTimeDTOs);

        return dto;
    }






    private Page<Event> findAllEvents(Pageable pageable) {
        Page<Integer> eventIds = eventRepository.findAllEventIds(pageable);
        return new PageImpl<>(eventRepository.findAllEventByIds(eventIds.getContent()), pageable, eventIds.getTotalElements());
    }

    @Override
    public PageResponse<EventSummaryAdmin> searchEvent(Pageable pageable, String... search) {

        Page<Event> events = search != null && search.length != 0 ? searchCriteriaRepository.searchEvents(pageable, search) : findAllEvents(pageable) ;
        List<EventSummaryAdmin> eventSummaryAdminList = events.getContent().stream()
                .filter(event -> !event.getStatus().getStatusName().equalsIgnoreCase("DRAFT"))
                .map(event -> {
            Address address = event.getTblShowingTimes().stream().findFirst().get().getAddress();
            return EventSummaryAdmin
                    .builder()
                    .id(event.getId())
                    .eventTitle(event.getEventTitle())
                    .startTime(event.getStartTime())
                    .endTime(event.getEndTime())
                    .categoryName(event.getCategory().getCategoryName())
                    .description(event.getDescription())
                    .posterImage(event.getPosterImage())
                    .organizerName(event.getOrganizer().getOrgName())
                    .status(event.getStatus().getStatusName())
                    .ageRating(event.getAgeRating())
                    .address(address.getVenueName() + ", " + address.getCity() + " " + address.getLocation())
                    .build();
        }).toList();
        return PageResponse.<EventSummaryAdmin>builder()
                .totalElements((int) events.getTotalElements())
                .size(events.getSize())
                .number(events.getNumber())
                .totalPages(events.getTotalPages())
                .content(eventSummaryAdminList)
                .build();
    }

    private EventResponse mapToEventResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getPosterImage(),
                event.getEventTitle(),
                event.getStartTime()
        );
    }

    @Override
    public EventDetailAdmin getEventDetailAdmin(int eventId) {
        Event event = eventRepository.findById(eventId).get();
        Address address = event.getTblShowingTimes().stream().findFirst().get().getAddress();
        return EventDetailAdmin.builder()
                .id(event.getId())
                .eventTitle(event.getEventTitle())
                .ageRating(event.getAgeRating())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .description(event.getDescription())
                .bannerText(event.getBannerText())
                .headerImage(event.getHeaderImage())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .status(event.getStatus().getStatusName())
                .rejectionReason(event.getRejectionReason())
                .organizerId(event.getOrganizer().getId())
                .organizerName(event.getOrganizer().getOrgName())
                .address(address.getVenueName() + ", " + address.getCity() + address.getLocation())
                .orgLogoUrl(event.getOrganizer().getOrgLogoUrl())
                .organizerEmail(event.getOrganizer().getUser().getEmail())
                .categoryName(event.getCategory().getCategoryName())
                .showingTimes(event.getTblShowingTimes().stream().map(showingTime -> ShowingTimeDTO
                        .builder()
                        .startTime(showingTime.getStartTime())
                        .endTime(showingTime.getEndTime())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    @Override
    @Transactional
    @PutMapping("/edit/{eventId}")
    public Event editEvent(int eventId, EventRequest request) {
        // 1. Lấy event hiện tại
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện"));

        if (event.getStatus() == null || event.getStatus().getId() != 1) {
            throw new RuntimeException("Chỉ được chỉnh sửa sự kiện khi trạng thái là bản nháp!");
        }

        // 2. Update các trường cơ bản
        if (request.getCategoryId() != null) {
            // Cách chuẩn là lấy Category từ DB, nếu chắc chắn tồn tại, nếu không thì tạm như dưới:
            Category category = new Category();
            category.setCategoryId(request.getCategoryId());
            event.setCategory(category);
        }
        if (request.getEventTitle() != null)
            event.setEventTitle(request.getEventTitle());
        if (request.getDescription() != null)
            event.setDescription(request.getDescription());
        if (request.getStartTime() != null)
            event.setStartTime(request.getStartTime());
        if (request.getEndTime() != null)
            event.setEndTime(request.getEndTime());
        if (request.getAgeRating() != null)
            event.setAgeRating(request.getAgeRating());
        if (request.getBannerText() != null)
            event.setBannerText(request.getBannerText());
        if (request.getHeaderImage() != null)
            event.setHeaderImage(request.getHeaderImage());
        if (request.getPosterImage() != null)
            event.setPosterImage(request.getPosterImage());
        event.setModifiedBy("system"); // Nếu có info user thì dùng tên user

        if (request.getStatusId() != null) {
            EventStatus status = eventStatusRepository.findById(request.getStatusId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy status id = " + request.getStatusId()));
            event.setStatus(status);
        }
        if (request.getShowingTimes() != null && !request.getShowingTimes().isEmpty()) {
            for (ShowingTimeRequest stReq : request.getShowingTimes()) {
                if (stReq.getAddressId() != null) {
                    Address address = addressRepository.findById(stReq.getAddressId())
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy address id = " + stReq.getAddressId()));
                    if (stReq.getVenueName() != null)
                        address.setVenueName(stReq.getVenueName());
                    if (stReq.getLocation() != null)
                        address.setLocation(stReq.getLocation());
                    if (stReq.getCity() != null)
                        address.setCity(stReq.getCity());
                    addressRepository.save(address);
                }
            }
        }

        // 5. Lưu lại event và trả về
        return eventRepository.save(event);
    }



    @Override
    public List<Event> findEventsByOrganizerId(int organizerId) {
        return eventRepository.findByOrganizer_Id(organizerId);
    }

    @Override
    public List<Event> getEventsByStatus(Integer organizerId, Integer statusId) {
        return eventRepository.findByOrganizer_IdAndStatus_Id(organizerId, statusId);
    }

    @Override
    public void updateStatus(UpdateStatusEvent status, int eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        EventStatus eventStatus = eventStatusRepository.findByStatusName(status.getStatus()).orElseThrow(()->new ResourceNotFoundException("No status found"));
        event.setStatus(eventStatus);
        event.setUpdatedAt(Instant.now());
        if(status.getRejectionReason() != null) {
            event.setRejectionReason(status.getRejectionReason());
        }
        eventRepository.save(event);
    }
    @Override
    public Event findById(Integer id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id = " + id));
    }

    public List<EventHomeDTO> userSearchEvent(String[] search) {

        List<Event> events = search != null &&  search.length != 0 ? searchCriteriaRepository.userSearchEvent(search) : eventRepository.findAll();

        List<Event> filteredEvents = events.stream().filter(event ->
        {
            return event.getStatus().getStatusName().equals("APPROVED") && ((event.getEndTime() != null && !event.getEndTime().isBefore(LocalDateTime.now())) || (event.getStartTime() != null && !event.getStartTime().isBefore(LocalDateTime.now())));
        }).toList();
        List<EventMinPriceProjection> minPriceProjections = eventRepository.findMinPriceByEventIds(filteredEvents.stream().map(event -> event.getId().longValue()).toList());

        //Map giúp tìm kiếm lowestPrice với O(1)
        Map<Long, Double> priceMap = minPriceProjections.stream().collect(Collectors.toMap(EventMinPriceProjection::getEventId, EventMinPriceProjection::getMinPrice));
        return filteredEvents.stream().map(event-> new EventHomeDTO(event, priceMap.get(event.getId().longValue()))).toList();
    }


    @Override
    public FeaturedEventResponse getFeaturedEventsForHome() {
        LocalDateTime now = LocalDateTime.now();
        List<Event> allEvents = eventRepository.findApprovedEventsWithShowingsAndSeats();

        // Lọc ongoing
        List<EventHomeDTO> ongoing = allEvents.stream()
                .filter(e -> e.getTblShowingTimes() != null && !e.getTblShowingTimes().isEmpty())
                .filter(e -> e.getTblShowingTimes().stream().anyMatch(st ->
                        st.getSaleOpenTime() != null && st.getSaleCloseTime() != null &&
                                !now.isBefore(st.getSaleOpenTime()) && !now.isAfter(st.getSaleCloseTime())
                ))
                .map(event -> {
                    double minPrice = event.getTblShowingTimes().stream()
                            .flatMap(st -> st.getSeats().stream())
                            .mapToDouble(seat -> seat.getPrice().doubleValue())
                            .min()
                            .orElse(0.0);
                    return new EventHomeDTO(event, minPrice);
                })
                .collect(Collectors.toList());

        // Lọc upcoming
        List<EventHomeDTO> upcoming = allEvents.stream()
                .filter(e -> e.getTblShowingTimes() != null && !e.getTblShowingTimes().isEmpty())
                .filter(e -> e.getTblShowingTimes().stream().allMatch(st ->
                        st.getSaleOpenTime() != null && now.isBefore(st.getSaleOpenTime())
                ))
                .map(event -> {
                    double minPrice = event.getTblShowingTimes().stream()
                            .flatMap(st -> st.getSeats().stream())
                            .mapToDouble(seat -> seat.getPrice().doubleValue())
                            .min()
                            .orElse(0.0);
                    return new EventHomeDTO(event, minPrice);
                })
                .collect(Collectors.toList());

        return new FeaturedEventResponse(ongoing, upcoming);
    }


    @Override
    public List<EventResponse> getEventsForReviewByCategory(int categoryId) {
        LocalDateTime now = LocalDateTime.now();
        List<Event> events = eventRepository.findByCategory_CategoryIdAndStatus_StatusName(categoryId, "APPROVED");
        // Lọc event có ít nhất 1 showing đã kết thúc
        return events.stream()
                .filter(ev -> ev.getTblShowingTimes().stream().anyMatch(st -> st.getEndTime().isBefore(now)))
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<EventResponse> getEventsForReviewAllCategoriesPaged(int page, int size, String search, Integer categoryId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startTime").descending());

        // Viết 1 query repo custom: tìm event đã kết thúc, theo search & category (nếu có)
        Page<Event> eventPage = eventRepository.findEndedEvents(search, categoryId, pageable);

        List<EventResponse> content = eventPage.getContent().stream()
                .map(this::mapToEventResponse)
                .toList();

        return PageResponse.<EventResponse>builder()
                .content(content)
                .totalElements((int) eventPage.getTotalElements())
                .totalPages(eventPage.getTotalPages())
                .number(eventPage.getNumber())
                .size(eventPage.getSize())
                .build();
    }


}
