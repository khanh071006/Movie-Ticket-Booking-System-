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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", dto.getMovieId()));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", dto.getRoomId()));

        LocalDateTime startTime = dto.getStartTime();
        LocalDateTime endTime = startTime.plusMinutes(movie.getDurationMinutes() + 30);

        // Sử dụng Integer cho roomId
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
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", showtimeId));
        // TODO: Add check if any booking is associated with this showtime
        showtimeRepository.delete(showtime);
    }

    @Override
    public List<ShowtimeResponseDTO> getShowtimesByMovieAndCinema(UUID movieId, Integer cinemaId) { // Thay đổi từ UUID sang Integer
        List<Showtime> showtimes = showtimeRepository.findByMovieIdAndCinemaId(movieId, cinemaId);
        List<ShowtimeResponseDTO> dtos = new ArrayList<>();
        for (Showtime showtime : showtimes) {
            dtos.add(convertToResponseDTO(showtime));
        }
        return dtos;
    }

    @Override
    public List<ShowtimeResponseDTO> getShowtimesByMovie(UUID movieId) {
        List<Showtime> showtimes = showtimeRepository.findByMovieId(movieId);
        List<ShowtimeResponseDTO> dtos = new ArrayList<>();
        for (Showtime showtime : showtimes) {
            dtos.add(convertToResponseDTO(showtime));
        }
        return dtos;
    }

    @Override
    public ShowtimeResponseDTO getShowtimeById(UUID showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", showtimeId));
        return convertToResponseDTO(showtime);
    }
}
