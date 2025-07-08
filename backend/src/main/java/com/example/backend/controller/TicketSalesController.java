package com.example.backend.controller;

import com.example.backend.dto.response.TicketSalesDTO;
import com.example.backend.service.TicketSalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ticket-sales")
public class TicketSalesController {

    @Autowired
    private TicketSalesService ticketSalesService;

    @GetMapping
    public ResponseEntity<List<TicketSalesDTO>> getTicketSales(
            @RequestParam(required = false) Integer eventId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    ) {
        List<TicketSalesDTO> result = ticketSalesService.getTicketSales(eventId, fromDate, toDate);
        return ResponseEntity.ok(result);
    }
}
