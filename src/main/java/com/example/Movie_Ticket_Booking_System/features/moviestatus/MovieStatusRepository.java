package com.example.Movie_Ticket_Booking_System.features.moviestatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovieStatusRepository extends JpaRepository<MovieStatus, UUID> {
    boolean existsByName(String name);
    Optional<MovieStatus> findByName(String name);
}
