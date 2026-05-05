package com.example.Movie_Ticket_Booking_System.features.movie.dto;

import com.example.Movie_Ticket_Booking_System.features.movie.Movie;
import java.time.LocalDate;
import java.util.UUID;

public class ResMovieDTO {
    private UUID id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private LocalDate releaseDate;
    private String language;
    private String posterUrl;
    private String trailerUrl;

    public ResMovieDTO(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.description = movie.getDescription();
        this.durationMinutes = movie.getDurationMinutes();
        this.releaseDate = movie.getReleaseDate();
        this.language = movie.getLanguage();
        this.posterUrl = movie.getPosterUrl();
        this.trailerUrl = movie.getTrailerUrl();
    }

    // Getters
    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public String getLanguage() { return language; }
    public String getPosterUrl() { return posterUrl; }
    public String getTrailerUrl() { return trailerUrl; }
}
