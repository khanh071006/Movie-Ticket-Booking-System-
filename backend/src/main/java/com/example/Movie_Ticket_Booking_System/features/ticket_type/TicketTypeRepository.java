package com.example.Movie_Ticket_Booking_System.features.ticket_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Integer> {
    Optional<TicketType> findByName(String name);
}
