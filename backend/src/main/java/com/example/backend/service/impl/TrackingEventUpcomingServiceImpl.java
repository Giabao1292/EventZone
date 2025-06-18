package com.example.backend.service.impl;

import com.example.backend.model.Event;
import com.example.backend.model.TrackingEventUpcoming;
import com.example.backend.model.User;
import com.example.backend.repository.TrackingEventUpcomingRepository;
import com.example.backend.service.TrackingEventUpcomingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TrackingEventUpcomingServiceImpl implements TrackingEventUpcomingService {

    private final TrackingEventUpcomingRepository trackingRepository;

    @Override
    public TrackingEventUpcoming trackEvent(User user, Event event) {
        return trackingRepository.findByUserAndEvent(user, event)
                .orElseGet(() -> {
                    TrackingEventUpcoming tracking = new TrackingEventUpcoming();
                    tracking.setUser(user);
                    tracking.setEvent(event);
                    tracking.setTrackingTime(Instant.now());
                    return trackingRepository.save(tracking);
                });
    }

    @Override
    public void untrackEvent(User user, Event event) {
        trackingRepository.deleteByUserAndEvent(user, event);
    }

    @Override
    public boolean isTracking(User user, Event event) {
        return trackingRepository.findByUserAndEvent(user, event).isPresent();
    }

    @Override
    public List<Event> getTrackedEventsByUser(User user) {
        return trackingRepository.findByUser(user).stream()
                .map(TrackingEventUpcoming::getEvent)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getUsersTrackingEvent(Event event) {
        return trackingRepository.findAllByEvent_Id(event.getId()).stream()
                .map(TrackingEventUpcoming::getUser)
                .collect(Collectors.toList());
    }
}
