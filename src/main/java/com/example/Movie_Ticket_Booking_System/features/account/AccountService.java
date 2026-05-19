package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqUpdateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ResAccountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

public interface AccountService {

    Account handleRegister(ReqRegisterDTO dto);

    Account handleGetAccountByEmail(String email);

    List<Account> handleGetAccounts();

    Page<ResAccountDTO> getAllAccounts(Pageable pageable);

    ResAccountDTO getAccountById(UUID id);

    ResAccountDTO updateAccount(UUID id, ReqUpdateAccountDTO dto);

    void deleteAccount(UUID id);
}
