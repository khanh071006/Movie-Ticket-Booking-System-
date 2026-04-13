package com.example.Movie_Ticket_Booking_System.features.auth.dto;

import java.util.UUID;

public class ResAuthDTO {
    private UUID id;
    private String email;
    private String fullName;

    public ResAuthDTO(UUID id, String email, String fullName) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
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
}
