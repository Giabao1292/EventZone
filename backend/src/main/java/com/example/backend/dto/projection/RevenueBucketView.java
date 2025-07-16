package com.example.backend.dto.projection;

import java.math.BigDecimal;

public interface RevenueBucketView {
    String getBucket();
    BigDecimal getAds();
    BigDecimal getBooking();
}
