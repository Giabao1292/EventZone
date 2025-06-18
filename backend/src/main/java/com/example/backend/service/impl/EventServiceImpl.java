package com.example.backend.service.impl;

import com.example.backend.dto.request.EventRequest;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final OrganizerRepository organizerRepository;

    @Override
    public List<EventResponse> getPosterImagesByCategory(int categoryId) {
        List<Event> events = eventRepository.findByCategory_CategoryId(categoryId);
        return events.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }


    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryResponse(c.getCategoryId(), c.getCategoryName()))
                .collect(Collectors.toList());
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
        event.setStatusId(1);
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

        event.setStatusId(2);
        return eventRepository.save(event);
    }

    @Override
    public EventDetailDTO getEventDetailById(int eventId) {
        Event event = eventRepository.findEventDetail(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện với ID = " + eventId));

        EventDetailDTO dto = new EventDetailDTO();
        dto.setId(event.getId());
        dto.setEventTitle(event.getEventTitle());
        dto.setDescription(event.getDescription());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setHeaderImage(event.getHeaderImage());

        List<ShowingTimeDTO> showingTimeDTOs = event.getTblShowingTimes().stream().map(st -> {
            ShowingTimeDTO stDto = new ShowingTimeDTO();
            stDto.setId(st.getId());
            stDto.setStartTime(st.getStartTime());
            stDto.setEndTime(st.getEndTime());
            stDto.setLayoutMode(st.getLayoutMode());

            Address address = st.getAddress();
            AddressDTO addrDto = new AddressDTO();
            addrDto.setId(address.getId());
            addrDto.setVenueName(address.getVenueName());
            addrDto.setLocation(address.getLocation());
            addrDto.setCity(address.getCity());
            stDto.setAddress(addrDto);

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

            return stDto;
        }).collect(Collectors.toList());

        dto.setShowingTimes(showingTimeDTOs);
        return dto;
    }

    private EventResponse mapToEventResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getPosterImage(),
                event.getEventTitle(),
                event.getStartTime()
        );
    }
}
