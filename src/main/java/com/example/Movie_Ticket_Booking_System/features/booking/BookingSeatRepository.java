package com.example.Movie_Ticket_Booking_System.features.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, UUID> {
    List<BookingSeat> findByBooking_ShowtimeIdAndSeatIdIn(UUID showtimeId, List<Integer> seatIds);

    @Query("SELECT bs.seat.id FROM BookingSeat bs WHERE bs.booking.showtime.id = :showtimeId AND bs.booking.paymentStatus != 'FAILED'")
    List<Integer> findBookedSeatIdsByShowtimeId(@Param("showtimeId") UUID showtimeId);
}
