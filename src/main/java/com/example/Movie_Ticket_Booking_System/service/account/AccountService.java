package com.example.Movie_Ticket_Booking_System.service.account;

import com.example.Movie_Ticket_Booking_System.domain.dto.account.AccountRequestDTO;
import com.example.Movie_Ticket_Booking_System.domain.entity.Account;

public interface AccountService {

    Account handleRegister(AccountRequestDTO dto);
}
