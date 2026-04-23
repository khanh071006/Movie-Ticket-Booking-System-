package com.example.Movie_Ticket_Booking_System.features.account.dto;

import java.util.UUID;

public class ResAccountDTO {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private boolean isActive;

    public ResAccountDTO(UUID id, String email, String fullName, String phone, boolean isActive) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.isActive = isActive;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
