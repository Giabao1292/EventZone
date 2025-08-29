package com.example.backend.service;

import com.example.backend.dto.request.BankRequest;
import com.example.backend.dto.response.BankResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.model.UserBankAccount;
import com.example.backend.model.VerificationToken;
import com.example.backend.repository.UserBankAccountRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationRepository;
import com.google.zxing.NotFoundException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserBankAccountService {
    private final UserBankAccountRepository userBankAccountRepository;
    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final MailService mailService;

    public List<BankResponse> getAllBank(String email){
        List<UserBankAccount> bankAccountList = userBankAccountRepository.findAllByUser_Email(email);
        return bankAccountList.stream().map(bankAccount -> BankResponse.builder()
                .paymentId(bankAccount.getPaymentId())
                .bankName(bankAccount.getBankName())
                .endAccountNumber(bankAccount.getAccountNumber())
                .holderName(bankAccount.getHolderName())
                .isDefault(bankAccount.getIsDefault())
                .build()).toList();
    }

    public void setDefault(Integer bankAccountId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserBankAccount defaultAccount = userBankAccountRepository.findByIsDefaultIsAndUser_Email(1, email);
        if(defaultAccount != null){
            defaultAccount.setIsDefault(0);
            userBankAccountRepository.save(defaultAccount);
        }

        UserBankAccount newDefaultAccount = userBankAccountRepository.findById(bankAccountId).get();
        newDefaultAccount.setIsDefault(1);
        userBankAccountRepository.save(newDefaultAccount);
    }

    public void addBank(BankRequest bankRequest){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        verificationRepository.findByTokenAndEmail(bankRequest.getCode(), email).orElseThrow(() -> new ResourceNotFoundException("Verification Token not found"));

        User user = userRepository.findByEmail(email).get();
        UserBankAccount userBankAccount = new UserBankAccount();

        userBankAccount.setAccountNumber(bankRequest.getAccountNumber());
        userBankAccount.setHolderName(bankRequest.getHolderName());
        userBankAccount.setBankName(bankRequest.getBankName());
        userBankAccount.setIsDefault(0);
        userBankAccount.setUser(user);

        userBankAccountRepository.save(userBankAccount);
    }

    public void deleteBank(Integer bankAccountId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserBankAccount userBankAccount = userBankAccountRepository.findById(bankAccountId).orElseThrow( ()-> new ResourceNotFoundException("Bank Account not found"));
        if(email.equals(userBankAccount.getUser().getEmail())){
            userBankAccountRepository.deleteById(bankAccountId);
        }
        else{
            throw new ResourceNotFoundException("Organizer not found");
        }
    }

    public void generateToken() throws MessagingException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String token = UUID.randomUUID().toString().substring(0, 6);

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setExpiryDate(Instant.now().plusSeconds(60 * 5));
        verificationToken.setEmail(email);
        verificationRepository.save(verificationToken);

        mailService.sendBankAccountVerificationEmail(email, token);
    }
}
