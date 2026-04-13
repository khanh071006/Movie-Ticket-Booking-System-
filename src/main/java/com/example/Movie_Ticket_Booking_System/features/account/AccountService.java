package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import java.util.List;

public interface AccountService {

    Account handleRegister(ReqRegisterDTO dto);

    Account handleGetAccountByEmail(String email);

    List<Account> handleGetAccounts();
}
