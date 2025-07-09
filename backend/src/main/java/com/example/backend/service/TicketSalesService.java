package com.example.backend.service;

import com.example.backend.dto.response.TicketSalesDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketSalesService {
    List<TicketSalesDTO> getTicketSales(Integer eventId, LocalDateTime fromDate, LocalDateTime toDate);
}
