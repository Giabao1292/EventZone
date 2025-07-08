package com.example.backend.dto.response;

import java.math.BigDecimal;

public class TicketSalesDTO {
    private Integer eventId;
    private String eventTitle;
    private Long ticketsSold;
    private BigDecimal totalRevenue;

    public TicketSalesDTO(Integer eventId, String eventTitle, Long ticketsSold, BigDecimal totalRevenue) {
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.ticketsSold = ticketsSold;
        this.totalRevenue = totalRevenue;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public Long getTicketsSold() {
        return ticketsSold;
    }

    public void setTicketsSold(Long ticketsSold) {
        this.ticketsSold = ticketsSold;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}

