package com.example.Movie_Ticket_Booking_System.service.account;

import com.example.Movie_Ticket_Booking_System.domain.dto.account.AccountRequestDTO;
import com.example.Movie_Ticket_Booking_System.domain.entity.Account;
import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.repository.AccountRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    // Sau này ông sẽ tiêm thêm PasswordEncoder ở đây

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional
    public Account handleRegister(AccountRequestDTO dto) {
        // 1. Kiểm tra trùng Email - Dùng Custom Exception đã tạo
        if (this.accountRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Account", "email", dto.getEmail());
        }

        // 2. Map từ DTO sang Entity
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());
        // Tạm thời để password chưa mã hóa
        account.setPasswordHash(dto.getPassword());

        // 3. Lưu vào Database
        return this.accountRepository.save(account);
    }
}
