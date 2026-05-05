package com.example.Movie_Ticket_Booking_System.features.showtime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, UUID> {
    // Method to find all showtimes for a list of room IDs
    List<Showtime> findByRoomIdIn(List<UUID> roomIds);
}
