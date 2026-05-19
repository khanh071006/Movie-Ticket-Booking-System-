package com.example.Movie_Ticket_Booking_System.security;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

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
            throw new UsernameNotFoundException("Không tìm thấy tài khoản với email: " + username);
        }

        return new org.springframework.security.core.userdetails.User(
                account.getEmail(),
                account.getPasswordHash(),
                account.getAccountRoles().stream()
                        .map(accountRole -> new SimpleGrantedAuthority("ROLE_" + accountRole.getRole().getName()))
                        .collect(Collectors.toList())
        );
    }
}
