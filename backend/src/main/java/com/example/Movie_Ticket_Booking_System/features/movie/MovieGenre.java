package com.example.Movie_Ticket_Booking_System.features.movie;

import com.example.Movie_Ticket_Booking_System.features.genre.Genre;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "movie_genre", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"movie_id", "genre_id"})
})
public class MovieGenre {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;

    public MovieGenre() {
    }

    public MovieGenre(Movie movie, Genre genre) {
        this.movie = movie;
        this.genre = genre;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Genre getGenre() {
        return genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }
}
