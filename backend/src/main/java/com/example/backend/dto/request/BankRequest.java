package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BankRequest {

    @NotBlank(message = "Tên ngân hàng không được để trống")
    private String bankName;

    @NotBlank(message = "Số tài khoản không được để trống")
    @Pattern(regexp = "\\d{6,20}", message = "Số tài khoản phải gồm 6 đến 20 chữ số")
    private String accountNumber;

    @NotBlank(message = "Tên chủ tài khoản không được để trống")
    @Size(max = 100, message = "Tên chủ tài khoản không được vượt quá 100 ký tự")
    private String holderName;

    @NotNull(message = "Trạng thái mặc định không được để trống")
    @Min(value = 0, message = "Giá trị mặc định không hợp lệ")
    @Max(value = 1, message = "Giá trị mặc định không hợp lệ")
    private Integer isDefault;

    @NotBlank(message = "Mã xác minh không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9]{6}$", message = "Mã xác minh phải gồm 6 ký tự chữ và/hoặc số")
    private String code;

}
