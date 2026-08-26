package com.example.Movie_Ticket_Booking_System.features.moviestatus;

import jakarta.persistence.*;

@Entity
@Table(name = "movie_status")
public class MovieStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Now Showing", "Coming Soon"

    public MovieStatus() {
    }

    public MovieStatus(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

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
}
