package com.example.Movie_Ticket_Booking_System.features.seat_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatTypeRepository extends JpaRepository<SeatType, Integer> {
    Optional<SeatType> findByName(String name);
}
