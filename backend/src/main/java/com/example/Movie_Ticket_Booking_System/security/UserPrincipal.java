package com.example.Movie_Ticket_Booking_System.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.UUID;

public class UserPrincipal extends User {
    private final UUID accountId;
    private final Integer cinemaId;

    public UserPrincipal(UUID accountId, Integer cinemaId, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.accountId = accountId;
        this.cinemaId = cinemaId;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public Integer getCinemaId() {
        return cinemaId;
    }
}
