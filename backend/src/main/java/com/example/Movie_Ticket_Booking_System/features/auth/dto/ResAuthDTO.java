package com.example.Movie_Ticket_Booking_System.features.auth.dto;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResAuthDTO {

    @JsonProperty("token")
    private TokenInfo tokenInfo;

    @JsonProperty("account")
    private AccountInfo accountInfo;

    public ResAuthDTO(TokenInfo tokenInfo, Account account) {
        this.tokenInfo = tokenInfo;
        this.accountInfo = new AccountInfo(account);
    }

    // Inner class cho thông tin Token
    public static class TokenInfo {
        private String accessToken;
        private String tokenType;
        private long expiresIn;

        public TokenInfo(String accessToken, String tokenType, long expiresIn) {
            this.accessToken = accessToken;
            this.tokenType = tokenType;
            this.expiresIn = expiresIn;
        }

        // Getters
        public String getAccessToken() { return accessToken; }
        public String getTokenType() { return tokenType; }
        public long getExpiresIn() { return expiresIn; }
    }

    // Inner class cho thông tin Account
    public static class AccountInfo {
        private java.util.UUID id;
        private String email;
        private String fullName;
        private java.util.Set<String> roles;
        private Integer cinemaId;
        private String cinemaName;

        public AccountInfo(Account account) {
            this.id = account.getId();
            this.email = account.getEmail();
            this.fullName = account.getFullName();
            if (account.getAccountRoles() != null) {
                this.roles = account.getAccountRoles().stream().map(r -> r.getRole().getName()).collect(java.util.stream.Collectors.toSet());
            } else {
                this.roles = new java.util.HashSet<>();
            }
            this.cinemaId = account.getCinema() != null ? account.getCinema().getId() : null;
            this.cinemaName = account.getCinema() != null ? account.getCinema().getName() : null;
        }

        // Getters
        public java.util.UUID getId() { return id; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public java.util.Set<String> getRoles() { return roles; }
        public Integer getCinemaId() { return cinemaId; }
        public String getCinemaName() { return cinemaName; }
    }

    // Getters
    public TokenInfo getTokenInfo() { return tokenInfo; }
    public AccountInfo getAccountInfo() { return accountInfo; }
}
