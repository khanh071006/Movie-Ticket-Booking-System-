package com.example.Movie_Ticket_Booking_System.features.cinema_pricing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CinemaSeatPriceRepository extends JpaRepository<CinemaSeatPrice, Integer> {
    List<CinemaSeatPrice> findByCinemaId(Integer cinemaId);
    Optional<CinemaSeatPrice> findByCinemaIdAndSeatTypeId(Integer cinemaId, Integer seatTypeId);
    void deleteByCinemaId(Integer cinemaId);
}
