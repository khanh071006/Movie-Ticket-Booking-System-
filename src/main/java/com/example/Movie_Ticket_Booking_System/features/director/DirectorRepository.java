package com.example.Movie_Ticket_Booking_System.features.director;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DirectorRepository extends JpaRepository<Director, Integer> {
    Optional<Director> findByName(String name);
}
