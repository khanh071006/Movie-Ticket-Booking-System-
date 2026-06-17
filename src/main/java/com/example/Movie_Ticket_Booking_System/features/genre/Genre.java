package com.example.Movie_Ticket_Booking_System.features.genre;

import com.example.Movie_Ticket_Booking_System.features.movie.MovieGenre;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "genres")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MovieGenre> movieGenres = new HashSet<>();

    public Genre() {
    }

    public Genre(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<MovieGenre> getMovieGenres() {
        return movieGenres;
    }

    public void setMovieGenres(Set<MovieGenre> movieGenres) {
        this.movieGenres = movieGenres;
    }
}
