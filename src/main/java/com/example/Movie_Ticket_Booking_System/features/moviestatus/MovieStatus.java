package com.example.Movie_Ticket_Booking_System.features.moviestatus;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "movie_status")
public class MovieStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Now Showing", "Coming Soon"

    public MovieStatus() {
    }

    public MovieStatus(UUID id, String name) {
        this.id = id;
        this.name = name;
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
