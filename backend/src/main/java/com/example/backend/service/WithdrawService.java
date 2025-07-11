package com.example.backend.service;

import com.example.backend.dto.request.WithdrawEligibleEventDTO;
import com.example.backend.dto.request.WithdrawRequestDTO;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.model.WithdrawRequest;

import java.util.List;

public interface WithdrawService {
    List<WithdrawEligibleEventDTO> getEligibleEventsForWithdrawal(User user);
    WithdrawRequest createWithdrawRequest(User user, WithdrawRequestDTO requestDTO);
    void approveWithdrawRequest(Integer requestId);
    void rejectWithdrawRequest(Integer requestId, String reason);
    List<WithdrawRequestDTO> getProcessedRequests();
     List<WithdrawRequestDTO> getAllRequests() ;
    List<WithdrawRequestDTO> getRequestsByUser(User user);
}

