package com.example.backend.controller;
import com.example.backend.dto.request.WithdrawEligibleEventDTO;
import com.example.backend.dto.request.WithdrawRequestDTO;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.User;
import com.example.backend.model.WithdrawRequest;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.WithdrawService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/withdraw")
@AllArgsConstructor
public class WithdrawController {

    private final WithdrawService withdrawService;
    private final UserRepository userRepository;
    @GetMapping("/eligible-events")
    public ResponseEntity<ResponseData<List<WithdrawEligibleEventDTO>>> getEligibleEventsForWithdrawal() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WithdrawEligibleEventDTO> eligibleEvents = withdrawService
                .getEligibleEventsForWithdrawal(user);
        ResponseData<List<WithdrawEligibleEventDTO>> response = new ResponseData<>(
                200,
                "Lấy danh sách sự kiện đủ điều kiện rút tiền thành công",
                eligibleEvents
        );
        return ResponseEntity.ok(response);
    }
    @PostMapping("/request")
    public ResponseEntity<ResponseData<?>> createWithdrawRequest(
            @Valid @RequestBody WithdrawRequestDTO requestDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            WithdrawRequest withdrawRequest = withdrawService.createWithdrawRequest(user, requestDTO);
            ResponseData<Long> response = new ResponseData<>(
                    200,
                    "Tạo yêu cầu rút tiền thành công");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ResponseData<Integer> response = new ResponseData<>(400, e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
    @GetMapping("/processed")
    public ResponseEntity<ResponseData<List<WithdrawRequestDTO>>> getProcessedWithdrawRequests() {
        List<WithdrawRequestDTO> list = withdrawService.getProcessedRequests();
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách yêu cầu đã xử lý thành công", list));
    }
    @GetMapping("/all")
    public ResponseEntity<ResponseData<List<WithdrawRequestDTO>>> getAllWithdrawRequests() {
        List<WithdrawRequestDTO> list = withdrawService.getAllRequests();
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy tất cả yêu cầu rút tiền thành công", list));
    }
    @PostMapping("/{id}/approve")
    public ResponseEntity<ResponseData<String>> approveRequest(@PathVariable Integer id) {
        withdrawService.approveWithdrawRequest(id);
        return ResponseEntity.ok(new ResponseData<>(200, "Phê duyệt yêu cầu rút tiền thành công"));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ResponseData<String>> rejectRequest(@PathVariable Integer id, @RequestBody String reason) {
        withdrawService.rejectWithdrawRequest(id, reason);
        return ResponseEntity.ok(new ResponseData<>(200, "Từ chối yêu cầu rút tiền thành công"));
    }
    @GetMapping("/my-requests")
    public ResponseEntity<ResponseData<List<WithdrawRequestDTO>>> getMyWithdrawRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<WithdrawRequestDTO> list = withdrawService.getRequestsByUser(user);
        return ResponseEntity.ok(new ResponseData<>(200, "Lấy danh sách yêu cầu rút tiền của bạn thành công", list));
    }

}