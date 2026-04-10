package com.example.Movie_Ticket_Booking_System.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "account_roles")
public class AccountRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @ManyToOne
    @JoinColumn(name = "account_id",nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
}
