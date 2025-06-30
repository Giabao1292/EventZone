package com.example.backend.service.impl;

import com.cloudinary.api.exceptions.BadRequest;
import com.example.backend.dto.request.VoucherRequest;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.dto.response.VoucherResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Voucher;
import com.example.backend.repository.SearchCriteriaRepository;
import com.example.backend.repository.VoucherRepository;
import com.example.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final SearchCriteriaRepository searchCriteriaRepository;

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
        Voucher voucher = voucherRepository.findById(id).orElseThrow(()-> new RuntimeException("Voucher not found"));
        voucher.setStatus(status);
        voucherRepository.save(voucher);
    }

    @Override
    public void updateVoucher(int id, VoucherRequest voucherRequest) {
        validDate(voucherRequest);
        Voucher existingVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + id));
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
            throw new IllegalArgumentException("ValidUntil date must be after validFrom");
        }
    }
}
