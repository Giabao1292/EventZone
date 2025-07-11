
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    private final OrganizerRepository organizerRepository;

    private final EventStatusRepository eventStatusRepository;

    private final SearchCriteriaRepository searchCriteriaRepository;

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;


    @Override
    public List<EventResponse> getPosterImagesByCategory(int categoryId) {
        List<Event> events = eventRepository.findByCategory_CategoryId(categoryId);
        return events.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<Event> getApprovedEvents() {
        return eventRepository.findByStatus_StatusName("APPROVED");
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
    public EventDetailDTO getEventDetailById(int eventId) {
        Event event = eventRepository.findEventDetail(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện với ID = " + eventId));

        // Mapping danh sách ShowingTime (nếu có)
        List<ShowingTimeDTO> showingTimeDTOs = event.getTblShowingTimes().stream().map(st -> {
            ShowingTimeDTO stDto = new ShowingTimeDTO();
            stDto.setId(st.getId());
            stDto.setStartTime(st.getStartTime());
            stDto.setEndTime(st.getEndTime());
            stDto.setLayoutMode(st.getLayoutMode());
            stDto.setSaleOpenTime(st.getSaleOpenTime());
            stDto.setSaleCloseTime(st.getSaleCloseTime());

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

            // Mapping Seats (nếu có)
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

            // Mapping Zones (nếu có)
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

        // Lấy thông tin địa điểm chung (nếu muốn lấy luôn từ ShowingTime đầu)
        String location = null;
        String city = null;
        String venueName = null;
        if (event.getTblShowingTimes() != null && !event.getTblShowingTimes().isEmpty()) {
            ShowingTime firstST = event.getTblShowingTimes().iterator().next();
            if (firstST.getAddress() != null) {
                location = firstST.getAddress().getLocation();
                city = firstST.getAddress().getCity();
                venueName = firstST.getAddress().getVenueName();
            }
        }

        // Tạo và mapping đầy đủ các field cho EventDetailDTO
        EventDetailDTO dto = new EventDetailDTO();
        dto.setId(event.getId());
        dto.setEventTitle(event.getEventTitle());
        dto.setDescription(event.getDescription());

        // Lấy categoryId từ entity Category (KHÔNG BAO GIỜ DÙNG event.getCategoryId())
        dto.setCategoryId(event.getCategory() != null ? event.getCategory().getCategoryId() : null);

        dto.setBannerText(event.getBannerText());
        dto.setHeaderImage(event.getHeaderImage());
        dto.setPosterImage(event.getPosterImage());
        dto.setAgeRating(event.getAgeRating());

        // Địa điểm tổng hợp từ ShowingTime đầu (nếu muốn lấy theo event, sửa lại field event)
        dto.setLocation(location);
        dto.setCity(city);
        dto.setVenueName(venueName);

        // Nếu có field maxCapacity (thêm vào entity Event nếu cần)
        // dto.setMaxCapacity(event.getMaxCapacity()); // Nếu có trong entity Event
        dto.setMaxCapacity(null);

        dto.setStartTime(event.getStartTime() != null ? event.getStartTime().toString() : null);
        dto.setEndTime(event.getEndTime() != null ? event.getEndTime().toString() : null);

        // Lấy statusId từ entity EventStatus (nếu có)
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

}
