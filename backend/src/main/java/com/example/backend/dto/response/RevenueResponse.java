package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RevenueResponse {
    private BigDecimal ticketSellingRevenue;
    private BigDecimal eventAdsRevenue;
    private List<RevenueDetail> revenueDetails;
}
