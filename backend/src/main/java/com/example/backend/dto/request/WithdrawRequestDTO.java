package com.example.backend.dto.request;


import com.example.backend.model.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class WithdrawRequestDTO {
    // ID của yêu cầu (dành cho response)
    private Integer id;

    // Thông tin sự kiện & suất chiếu (có thể dùng cho request và response)
    private Integer eventId;
    private Integer showingTimeId;
    private String eventTitle;
    private String organizerName;

    // Thông tin rút tiền
    private BigDecimal amount;
    private String bankAccountName;
    private String bankAccountNumber;
    private String bankName;
    private String note;

    // Trạng thái xử lý (response)
    private PaymentStatus status;
    private String rejectionReason;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
}
