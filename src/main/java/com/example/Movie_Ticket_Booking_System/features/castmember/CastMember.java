package com.example.Movie_Ticket_Booking_System.features.castmember;

import com.example.Movie_Ticket_Booking_System.features.movie.MovieCast;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cast_members")
public class CastMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "castMember", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MovieCast> movieCasts = new HashSet<>();

    public CastMember() {
    }

    public CastMember(Integer id, String name) {
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

    public Set<MovieCast> getMovieCasts() {
        return movieCasts;
    }

    public void setMovieCasts(Set<MovieCast> movieCasts) {
        this.movieCasts = movieCasts;
    }
}
