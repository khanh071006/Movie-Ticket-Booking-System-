package com.example.Movie_Ticket_Booking_System.security;

import com.example.Movie_Ticket_Booking_System.domain.entity.Account;
import com.example.Movie_Ticket_Booking_System.service.account.AccountService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountService accountService;

    public CustomUserDetailsService(AccountService accountService) {
        this.accountService = accountService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = this.accountService.handleGetAccountByEmail(username);

        if (account == null) {
            throw new UsernameNotFoundException("Không tìm thấy người dùng với email: " + username);
        }

        // 2. Chuyển đổi Account của mình thành UserDetails của Spring Security
        return org.springframework.security.core.userdetails.User.builder()
                .username(account.getEmail())
                .password(account.getPasswordHash())
                .roles("USER")
                .build();
    }
}