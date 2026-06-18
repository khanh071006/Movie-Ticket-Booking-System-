package com.example.Movie_Ticket_Booking_System.features.account.dto;

import java.util.Set;
import java.util.UUID;

public class ResAccountDTO {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private Set<String> roles;
    private Integer cinemaId;
    private String cinemaName;

    public ResAccountDTO(UUID id, String email, String fullName, String phone, Set<String> roles, Integer cinemaId, String cinemaName) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.roles = roles;
        this.cinemaId = cinemaId;
        this.cinemaName = cinemaName;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Integer getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Integer cinemaId) {
        this.cinemaId = cinemaId;
    }

    public String getCinemaName() {
        return cinemaName;
    }

    public void setCinemaName(String cinemaName) {
        this.cinemaName = cinemaName;
    }
}
