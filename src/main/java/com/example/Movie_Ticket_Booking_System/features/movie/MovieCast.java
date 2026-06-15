package com.example.Movie_Ticket_Booking_System.features.movie;

import com.example.Movie_Ticket_Booking_System.features.castmember.CastMember;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "movie_cast", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"movie_id", "cast_id"})
})
public class MovieCast {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cast_id", nullable = false)
    private CastMember castMember;

    public MovieCast() {
    }

    public MovieCast(Movie movie, CastMember castMember) {
        this.movie = movie;
        this.castMember = castMember;
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

    public CastMember getCastMember() {
        return castMember;
    }

    public void setCastMember(CastMember castMember) {
        this.castMember = castMember;
    }
}
