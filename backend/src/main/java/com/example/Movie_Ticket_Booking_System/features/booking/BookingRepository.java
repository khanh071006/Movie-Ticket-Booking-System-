package com.example.Movie_Ticket_Booking_System.features.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByAccount_EmailOrderByCreatedDatetimeDesc(String email);

    @org.springframework.data.jpa.repository.Query("SELECT cast(b.createdDatetime as date) as date, SUM(b.totalAmount) as total FROM Booking b WHERE b.paymentStatus = 'PAID' GROUP BY cast(b.createdDatetime as date) ORDER BY cast(b.createdDatetime as date)")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByDateProjection> getRevenueByDate();

    @org.springframework.data.jpa.repository.Query("SELECT cast(b.createdDatetime as date) as date, SUM(b.totalAmount) as total FROM Booking b JOIN b.showtime s JOIN s.room r WHERE b.paymentStatus = 'PAID' AND r.cinema.id = :cinemaId GROUP BY cast(b.createdDatetime as date) ORDER BY cast(b.createdDatetime as date)")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByDateProjection> getRevenueByDateByCinema(@org.springframework.data.repository.query.Param("cinemaId") Long cinemaId);

    @org.springframework.data.jpa.repository.Query("SELECT m.title as movieTitle, SUM(b.totalAmount) as total FROM Booking b JOIN b.showtime s JOIN s.movie m WHERE b.paymentStatus = 'PAID' GROUP BY m.id, m.title")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByMovieProjection> getRevenueByMovie();

    @org.springframework.data.jpa.repository.Query("SELECT m.title as movieTitle, SUM(b.totalAmount) as total FROM Booking b JOIN b.showtime s JOIN s.movie m JOIN s.room r WHERE b.paymentStatus = 'PAID' AND r.cinema.id = :cinemaId GROUP BY m.id, m.title")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByMovieProjection> getRevenueByMovieByCinema(@org.springframework.data.repository.query.Param("cinemaId") Long cinemaId);

    @org.springframework.data.jpa.repository.Query("SELECT c.name as cinemaName, SUM(b.totalAmount) as total FROM Booking b JOIN b.showtime s JOIN s.room r JOIN r.cinema c WHERE b.paymentStatus = 'PAID' GROUP BY c.id, c.name")
    List<com.example.Movie_Ticket_Booking_System.features.report.RevenueByCinemaProjection> getRevenueByCinema();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Booking b SET b.paymentStatus = 'CANCELED' WHERE b.paymentStatus = 'PENDING' AND b.createdDatetime < :threshold")
    int cancelAbandonedBookings(@org.springframework.data.repository.query.Param("threshold") java.time.LocalDateTime threshold);
}
