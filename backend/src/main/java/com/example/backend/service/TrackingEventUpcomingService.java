package com.example.backend.service;

import com.example.backend.model.Event;
import com.example.backend.model.TrackingEventUpcoming;
import com.example.backend.model.User;

import java.util.List;

public interface TrackingEventUpcomingService {

    TrackingEventUpcoming trackEvent(User user, Event event);

    void untrackEvent(User user, Event event);

    boolean isTracking(User user, Event event);

    List<Event> getTrackedEventsByUser(User user);

    List<User> getUsersTrackingEvent(Event event);
}

