package com.example.Movie_Ticket_Booking_System.features.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {
    // Method to find all rooms belonging to a specific cinema
    List<Room> findByCinemaId(UUID cinemaId);
}
