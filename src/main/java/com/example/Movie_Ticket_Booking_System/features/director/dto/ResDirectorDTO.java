package com.example.Movie_Ticket_Booking_System.features.director.dto;

import com.example.Movie_Ticket_Booking_System.features.director.Director;

import java.util.UUID;

public class ResDirectorDTO {
    private UUID id;
    private String name;

    public ResDirectorDTO(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ResDirectorDTO fromDirector(Director director) {
        return new ResDirectorDTO(director.getId(), director.getName());
    }

    // Getters and setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
