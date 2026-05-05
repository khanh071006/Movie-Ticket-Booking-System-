package com.example.Movie_Ticket_Booking_System.features.showtime;

import com.example.Movie_Ticket_Booking_System.features.movie.Movie;
import com.example.Movie_Ticket_Booking_System.features.movie.MovieRepository;
import com.example.Movie_Ticket_Booking_System.features.room.Room;
import com.example.Movie_Ticket_Booking_System.features.room.RoomRepository;
import com.example.Movie_Ticket_Booking_System.features.showtime.dto.ShowtimeRequestDTO;
import com.example.Movie_Ticket_Booking_System.features.showtime.dto.ShowtimeResponseDTO;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    public ShowtimeServiceImpl(ShowtimeRepository showtimeRepository, MovieRepository movieRepository, RoomRepository roomRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.roomRepository = roomRepository;
    }

    private ShowtimeResponseDTO convertToResponseDTO(Showtime showtime) {
        ShowtimeResponseDTO.MovieInfo movieInfo = ShowtimeResponseDTO.MovieInfo.builder()
                .id(showtime.getMovie().getId())
                .title(showtime.getMovie().getTitle())
                .durationMinutes(showtime.getMovie().getDurationMinutes())
                .build();

        ShowtimeResponseDTO.CinemaInfo cinemaInfo = ShowtimeResponseDTO.CinemaInfo.builder()
                .id(showtime.getRoom().getCinema().getId())
                .name(showtime.getRoom().getCinema().getName())
                .build();

        ShowtimeResponseDTO.RoomInfo roomInfo = ShowtimeResponseDTO.RoomInfo.builder()
                .id(showtime.getRoom().getId())
                .name(showtime.getRoom().getName())
                .cinema(cinemaInfo)
                .build();

        return ShowtimeResponseDTO.builder()
                .id(showtime.getId())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .movie(movieInfo)
                .room(roomInfo)
                .build();
    }

    @Override
    public ShowtimeResponseDTO createShowtime(ShowtimeRequestDTO dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + dto.getMovieId()));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + dto.getRoomId()));

        LocalDateTime startTime = dto.getStartTime();
        // Assuming a 30-minute cleanup/buffer time after each movie
        LocalDateTime endTime = startTime.plusMinutes(movie.getDurationMinutes() + 30);

        // Check for overlapping showtimes
        List<Showtime> overlapping = showtimeRepository.findOverlappingShowtimes(room.getId(), startTime, endTime);
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Showtime conflicts with an existing showtime in the same room.");
        }

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(startTime);
        showtime.setEndTime(endTime);

        Showtime savedShowtime = showtimeRepository.save(showtime);
        return convertToResponseDTO(savedShowtime);
    }

    @Override
    public void deleteShowtime(UUID showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + showtimeId));
        // TODO: Add check here to prevent deletion if there are active bookings for this showtime.
        showtimeRepository.delete(showtime);
    }

    @Override
    public List<ShowtimeResponseDTO> getShowtimesByMovieAndCinema(UUID movieId, UUID cinemaId) {
        return showtimeRepository.findByMovieIdAndCinemaId(movieId, cinemaId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShowtimeResponseDTO> getShowtimesByMovie(UUID movieId) {
        return showtimeRepository.findByMovieId(movieId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
}
