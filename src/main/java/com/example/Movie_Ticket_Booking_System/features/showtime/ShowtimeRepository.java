package com.example.Movie_Ticket_Booking_System.features.showtime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, UUID> {
    // Cập nhật để sử dụng Integer cho roomIds
    List<Showtime> findByRoomIdIn(List<Integer> roomIds);

    @Query("SELECT s FROM Showtime s WHERE s.room.id = :roomId AND s.endTime > :startTime AND s.startTime < :endTime")
    List<Showtime> findOverlappingShowtimes(@Param("roomId") Integer roomId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    List<Showtime> findByMovieId(UUID movieId);

    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND s.room.cinema.id = :cinemaId")
    List<Showtime> findByMovieIdAndCinemaId(@Param("movieId") UUID movieId, @Param("cinemaId") Integer cinemaId);
}
