package com.example.backend.dto.projection;

import java.time.LocalDateTime;

public interface ReminderInfo {
    String getUserEmail();
    String getEventTitle();
    LocalDateTime getStartTime();
    LocalDateTime getSaleOpenTime();
}
