package com.example.Movie_Ticket_Booking_System.features.movie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> {
    org.springframework.data.domain.Page<Movie> findByTitleContainingIgnoreCase(String title, org.springframework.data.domain.Pageable pageable);
    
    java.util.List<Movie> findByMovieStatus_Name(String statusName);
}
