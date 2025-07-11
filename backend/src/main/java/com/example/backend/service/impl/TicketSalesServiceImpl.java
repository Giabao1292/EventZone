package com.example.backend.service.impl;

import com.example.backend.dto.response.TicketSalesDTO;
import com.example.backend.model.User;
import com.example.backend.repository.BookingSeatRepository;
import com.example.backend.service.TicketSalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.backend.repository.BookingSeatRepository;
import com.example.backend.service.TicketSalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketSalesServiceImpl implements TicketSalesService {

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Override
    public List<TicketSalesDTO> getTicketSales(Integer eventId, LocalDateTime fromDate, LocalDateTime toDate) {

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer organizerId = currentUser.getOrganizer().getId();

        return bookingSeatRepository.getTicketSalesSummary(eventId, fromDate, toDate, organizerId);

    }
}