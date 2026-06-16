package com.example.Movie_Ticket_Booking_System.features.cinema_pricing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CinemaTicketPriceRepository extends JpaRepository<CinemaTicketPrice, Integer> {
    List<CinemaTicketPrice> findByCinemaId(Integer cinemaId);
    Optional<CinemaTicketPrice> findByCinemaIdAndTicketTypeId(Integer cinemaId, Integer ticketTypeId);
    void deleteByCinemaId(Integer cinemaId);
}
