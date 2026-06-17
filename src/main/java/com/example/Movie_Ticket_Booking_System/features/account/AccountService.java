package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqCreateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqUpdateAccountDTO;

import java.util.List;
import java.util.UUID;

public interface AccountService {

    Account handleRegister(ReqRegisterDTO dto);

    Account handleGetAccountByEmail(String email);

    List<Account> handleGetAccounts();

    Account handleCreateAccount(ReqCreateAccountDTO dto);

    Account handleGetAccountById(UUID id);

    Account handleUpdateAccount(UUID id, ReqUpdateAccountDTO dto);

    void handleDeleteAccount(UUID id);

    void handleVerifyOtp(String email, String otpCode);
}
