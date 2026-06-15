package com.example.Movie_Ticket_Booking_System.features.role.dto;

import com.example.Movie_Ticket_Booking_System.features.role.Role;

public class ResRoleDTO {
    private int id;
    private String name;

    public ResRoleDTO(Role role) {
        this.id = role.getId();
        this.name = role.getName();
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
