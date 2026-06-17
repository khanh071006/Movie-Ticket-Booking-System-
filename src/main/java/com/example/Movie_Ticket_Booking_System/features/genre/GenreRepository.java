package com.example.Movie_Ticket_Booking_System.features.genre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {
    boolean existsByName(String name);
    Optional<Genre> findByName(String name);
}
