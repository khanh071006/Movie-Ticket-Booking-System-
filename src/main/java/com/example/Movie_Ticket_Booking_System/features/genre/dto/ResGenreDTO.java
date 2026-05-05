package com.example.Movie_Ticket_Booking_System.features.genre.dto;

import com.example.Movie_Ticket_Booking_System.features.genre.Genre;

import java.util.UUID;

public class ResGenreDTO {
    private UUID id;
    private String name;

    public ResGenreDTO(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ResGenreDTO fromGenre(Genre genre) {
        return new ResGenreDTO(genre.getId(), genre.getName());
    }

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
