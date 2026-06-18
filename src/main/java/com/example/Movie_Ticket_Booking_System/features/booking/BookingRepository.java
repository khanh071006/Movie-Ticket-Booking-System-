package com.example.Movie_Ticket_Booking_System.features.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByAccount_EmailOrderByCreatedDatetimeDesc(String email);

    @org.springframework.data.jpa.repository.Query(value = "SELECT CAST(b.created_datetime AS date) as date, SUM(b.total_amount) as total FROM bookings b WHERE b.payment_status = 'PAID' GROUP BY CAST(b.created_datetime AS date) ORDER BY CAST(b.created_datetime AS date)", nativeQuery = true)
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByDateProjection> getRevenueByDate();

    @org.springframework.data.jpa.repository.Query(value = "SELECT CAST(b.created_datetime AS date) as date, SUM(b.total_amount) as total FROM bookings b JOIN showtimes s ON b.showing_id = s.id JOIN rooms r ON s.room_id = r.id WHERE b.payment_status = 'PAID' AND r.cinema_id = :cinemaId GROUP BY CAST(b.created_datetime AS date) ORDER BY CAST(b.created_datetime AS date)", nativeQuery = true)
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByDateProjection> getRevenueByDateByCinema(@org.springframework.data.repository.query.Param("cinemaId") Long cinemaId);

    @org.springframework.data.jpa.repository.Query("SELECT m.title as movieTitle, SUM(b.totalAmount) as total FROM Booking b JOIN b.showtime s JOIN s.movie m WHERE b.paymentStatus = 'PAID' GROUP BY m.id, m.title")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByMovieProjection> getRevenueByMovie();

    @org.springframework.data.jpa.repository.Query("SELECT m.title as movieTitle, SUM(b.totalAmount) as total FROM Booking b JOIN b.showtime s JOIN s.movie m JOIN s.room r WHERE b.paymentStatus = 'PAID' AND r.cinema.id = :cinemaId GROUP BY m.id, m.title")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByMovieProjection> getRevenueByMovieByCinema(@org.springframework.data.repository.query.Param("cinemaId") Long cinemaId);

    @org.springframework.data.jpa.repository.Query("SELECT c.name as cinemaName, SUM(b.totalAmount) as total FROM Booking b JOIN b.showtime s JOIN s.room r JOIN r.cinema c WHERE b.paymentStatus = 'PAID' GROUP BY c.id, c.name")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByCinemaProjection> getRevenueByCinema();
}
