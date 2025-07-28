package com.example.backend.service.impl;

import com.cloudinary.api.exceptions.BadRequest;
import com.example.backend.component.UserUtil;
import com.example.backend.dto.request.UserVoucherResponse;
import com.example.backend.dto.request.VoucherRequest;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.dto.response.VoucherResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.model.UserVoucher;
import com.example.backend.model.Voucher;
import com.example.backend.repository.SearchCriteriaRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserVoucherRepository;
import com.example.backend.repository.VoucherRepository;
import com.example.backend.service.VoucherService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final SearchCriteriaRepository searchCriteriaRepository;
    private final com.example.backend.repository.UserVoucherRepository userVoucherRepository;
    private final UserRepository userRepository;
    private final UserUtil userUtil;
    @Override
    public PageResponse<VoucherResponse> searchVoucher(Pageable pageable, String... search) {
        Page<Voucher> vouchers = search == null || search.length == 0 ? voucherRepository.findAll(pageable) : searchCriteriaRepository.searchVouchers(pageable, search);
        List<VoucherResponse> voucherResponses = vouchers.getContent().stream().map(voucher ->
                VoucherResponse.builder()
                        .voucherId(voucher.getId())
                        .voucherCode(voucher.getVoucherCode())
                        .voucherName(voucher.getVoucherName())
                        .description(voucher.getDescription())
                        .discountAmount(voucher.getDiscountAmount())
                        .requiredPoints(voucher.getRequiredPoints())
                        .validFrom(voucher.getValidFrom())
                        .validUntil(voucher.getValidUntil())
                        .status(voucher.getStatus())
                        .build()).toList();
        return PageResponse.<VoucherResponse>builder()
                .totalPages(vouchers.getTotalPages())
                .content(voucherResponses)
                .size(vouchers.getSize())
                .number(vouchers.getNumber())
                .totalElements((int)vouchers.getTotalElements())
                .build();
    }

    @Override
    public void updateStatus(int id, int status) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy voucher"));
        voucher.setStatus(status);
        voucherRepository.save(voucher);
    }
    @Override
    @Transactional
    public void redeemVoucher(int voucherId) {
        User user = userUtil.getCurrentUser(); // Giả sử bạn có hàm lấy user từ SecurityContext

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy voucher"));

        if (voucher.getStatus() != 1 || voucher.getValidUntil().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Voucher không hoạt động hoặc đã hết hạn");
        }

        if (user.getScore() < voucher.getRequiredPoints()) {
            throw new IllegalArgumentException("Không đủ điểm để đổi voucher này");
        }

        boolean alreadyRedeemed = userVoucherRepository.existsByUserIdAndVoucherId(user.getId(), voucherId);
        if (alreadyRedeemed) {
            throw new IllegalArgumentException("Bạn đã đổi voucher này rồi");
        }

        user.setScore(user.getScore() - voucher.getRequiredPoints());
        userRepository.save(user);

        // Ghi nhận đổi voucher
        UserVoucher userVoucher = new UserVoucher();
        userVoucher.setUser(user);
        userVoucher.setVoucher(voucher);
        userVoucherRepository.save(userVoucher);
    }

    @Override
    public void updateVoucher(int id, VoucherRequest voucherRequest) {
        validDate(voucherRequest);
        Voucher existingVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy voucher với id: " + id));
        existingVoucher.setVoucherCode(voucherRequest.getVoucherCode());
        existingVoucher.setVoucherName(voucherRequest.getVoucherName());
        existingVoucher.setDescription(voucherRequest.getDescription());
        existingVoucher.setRequiredPoints(voucherRequest.getRequiredPoints());
        existingVoucher.setDiscountAmount(voucherRequest.getDiscountAmount());
        existingVoucher.setValidFrom(voucherRequest.getValidFrom());
        existingVoucher.setValidUntil(voucherRequest.getValidUntil());
        existingVoucher.setStatus(voucherRequest.getStatus());
        voucherRepository.save(existingVoucher);
    }

    @Override
    public void createVoucher(VoucherRequest voucherRequest) {
        validDate(voucherRequest);
        Voucher voucher = new Voucher();
        voucher.setVoucherCode(voucherRequest.getVoucherCode());
        voucher.setVoucherName(voucherRequest.getVoucherName());
        voucher.setDescription(voucherRequest.getDescription());
        voucher.setRequiredPoints(voucherRequest.getRequiredPoints());
        voucher.setDiscountAmount(voucherRequest.getDiscountAmount());
        voucher.setValidFrom(voucherRequest.getValidFrom());
        voucher.setValidUntil(voucherRequest.getValidUntil());
        voucher.setStatus(voucherRequest.getStatus());
        voucherRepository.save(voucher);
    }
    private void validDate(VoucherRequest voucherRequest) {
        if(voucherRequest.getValidFrom().isAfter(voucherRequest.getValidUntil())){
            throw new IllegalArgumentException("Ngày hết hạn phải sau ngày bắt đầu");
        }
    }
    @Override
    public UserVoucherResponse getUserVouchers() {
        User user = userUtil.getCurrentUser();

        List<UserVoucher> redeemed = userVoucherRepository.findByUserIdAndIsUsedFalse(user.getId());;
        List<VoucherResponse> redeemedResponses = redeemed.stream()
                .map(uv -> VoucherResponse.fromEntity(uv.getVoucher()))
                .toList();

        List<Voucher> available = voucherRepository
                .findAvailableToRedeem(user.getId(), user.getScore(), LocalDate.now());

        List<VoucherResponse> availableResponses = available.stream()
                .map(VoucherResponse::fromEntity)
                .toList();

        return new UserVoucherResponse(redeemedResponses, availableResponses);
    }


}
