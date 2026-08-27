package com.example.Movie_Ticket_Booking_System.features.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, UUID> {
    @Query("SELECT bs FROM BookingSeat bs WHERE bs.booking.showtime.id = :showtimeId AND bs.seat.id IN :seatIds AND bs.booking.paymentStatus NOT IN ('FAILED', 'CANCELED')")
    List<BookingSeat> findByBooking_ShowtimeIdAndSeatIdIn(@Param("showtimeId") UUID showtimeId, @Param("seatIds") List<Integer> seatIds);

    @Query("SELECT bs.seat.id FROM BookingSeat bs WHERE bs.booking.showtime.id = :showtimeId AND bs.booking.paymentStatus NOT IN ('FAILED', 'CANCELED')")
    List<Integer> findBookedSeatIdsByShowtimeId(@Param("showtimeId") UUID showtimeId);
}
