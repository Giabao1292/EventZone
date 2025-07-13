package com.example.backend.model;

public enum ShowingTimeStatus {
    ACTIVE, // bình thường
    RESCHEDULE_PENDING, // đang chờ dời lịch
    RESCHEDULED, // đã dời
    CANCELLED // (nếu có)
}
