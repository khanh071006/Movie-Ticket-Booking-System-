package com.example.Movie_Ticket_Booking_System.features.showtime;

import com.example.Movie_Ticket_Booking_System.features.movie.Movie;
import com.example.Movie_Ticket_Booking_System.features.movie.MovieRepository;
import com.example.Movie_Ticket_Booking_System.features.room.Room;
import com.example.Movie_Ticket_Booking_System.features.room.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class ShowtimeAutoGeneratorServiceImpl implements ShowtimeAutoGeneratorService {

    private final ShowtimeRepository showtimeRepository;
    private final RoomRepository roomRepository;
    private final MovieRepository movieRepository;

    public ShowtimeAutoGeneratorServiceImpl(ShowtimeRepository showtimeRepository,
                                 RoomRepository roomRepository,
                                 MovieRepository movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.roomRepository = roomRepository;
        this.movieRepository = movieRepository;
    }

    @Transactional
    @Override
    public void handleGenerateShowtimesForNext7Days() {
        // 1. Fetch all active "Đang Chiếu" movies
        List<Movie> activeMovies = movieRepository.findByMovieStatus_Name("Đang Chiếu");

        if (activeMovies.isEmpty()) {
            System.out.println("No 'Đang Chiếu' movies available to schedule.");
            return;
        }

        // 2. Fetch all rooms (Theatres)
        List<Room> allRooms = roomRepository.findAll();
        if (allRooms.isEmpty()) {
            System.out.println("No rooms available to schedule.");
            return;
        }

        LocalDate today = LocalDate.now();
        Random random = new Random();
        int generatedCount = 0;

        // 3. Loop through next 7 days
        for (int i = 0; i < 7; i++) {
            LocalDate targetDate = today.plusDays(i);
            LocalDateTime startOfDay = targetDate.atStartOfDay();
            LocalDateTime endOfDay = targetDate.atTime(LocalTime.MAX);

            for (Room room : allRooms) {
                // Check if this room already has showtimes for this day
                // Using findOverlappingShowtimes logic
                List<Showtime> existingShowtimes = showtimeRepository.findOverlappingShowtimes(
                        room.getId(), startOfDay, endOfDay);

                if (existingShowtimes.isEmpty()) {
                    // Generate 3 showtimes per room (e.g. 10:00, 15:00, 20:00)
                    int[] hours = {10, 15, 20};
                    for (int hour : hours) {
                        Movie randomMovie = activeMovies.get(random.nextInt(activeMovies.size()));
                        
                        LocalDateTime startTime = targetDate.atTime(hour, 0);
                        int duration = randomMovie.getDurationMinutes() != null ? randomMovie.getDurationMinutes() : 120;
                        LocalDateTime endTime = startTime.plusMinutes(duration + 30); // 30 mins buffer for cleaning

                        Showtime showtime = new Showtime();
                        showtime.setMovie(randomMovie);
                        showtime.setRoom(room);
                        showtime.setStartTime(startTime);
                        showtime.setEndTime(endTime);

                        showtimeRepository.save(showtime);
                        generatedCount++;
                    }
                }
            }
        }
        
        System.out.println("Auto-generated " + generatedCount + " showtimes successfully.");
    }
}
