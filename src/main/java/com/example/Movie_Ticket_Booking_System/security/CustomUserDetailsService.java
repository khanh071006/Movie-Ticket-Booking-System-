package com.example.Movie_Ticket_Booking_System.security;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountService;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (account.getAccountRoles() != null) {
            for (AccountRole accountRole : account.getAccountRoles()) {
                // Giữ lại ROLE_ để tương thích nếu cần
                authorities.add(new SimpleGrantedAuthority("ROLE_" + accountRole.getRole().getName()));
                
                // Thêm các permissions của Role này vào
                if (accountRole.getRole().getRolePermissions() != null) {
                    for (com.example.Movie_Ticket_Booking_System.features.role.RolePermission rp : accountRole.getRole().getRolePermissions()) {
                        authorities.add(new SimpleGrantedAuthority(rp.getPermission().getCode()));
                    }
                }
            }
        }

        Integer cinemaId = account.getCinema() != null ? account.getCinema().getId() : null;

        return new UserPrincipal(
                account.getId(),
                cinemaId,
                account.getEmail(),
                account.getPasswordHash(),
                authorities
        );
    }
}
