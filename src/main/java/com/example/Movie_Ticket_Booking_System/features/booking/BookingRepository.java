package com.example.Movie_Ticket_Booking_System.features.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByAccount_EmailOrderByCreatedDatetimeDesc(String email);
}
