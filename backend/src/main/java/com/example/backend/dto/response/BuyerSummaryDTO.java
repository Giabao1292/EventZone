package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.Locale;

@Data
@Builder
@AllArgsConstructor
public class BuyerSummaryDTO {
    private String fullName;
    private String email;
    private String phone;
    private String eventTitle;
    private LocalDateTime bookingTime;
    private Long quantity;
    private BigDecimal totalAmount;

    public String getFormattedQuantity() {
        return String.format("%,d vé", quantity); // Ví dụ: "3 vé", "1,000 vé"
    }

    public String getFormattedTotalAmount() {
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return currencyFormatter.format(totalAmount); // Ví dụ: "₫200.000"
    }
}
