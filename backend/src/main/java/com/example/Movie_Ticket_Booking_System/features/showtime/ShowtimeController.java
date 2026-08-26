package com.example.Movie_Ticket_Booking_System.features.showtime;

import com.example.Movie_Ticket_Booking_System.features.showtime.dto.ShowtimeRequestDTO;
import com.example.Movie_Ticket_Booking_System.features.showtime.dto.ShowtimeResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

@PreAuthorize("hasAuthority('SHOWTIME_CREATE')")
    @PostMapping
    public ResponseEntity<ShowtimeResponseDTO> createShowtime(@Valid @RequestBody ShowtimeRequestDTO showtimeRequestDTO) {
        ShowtimeResponseDTO createdShowtime = showtimeService.createShowtime(showtimeRequestDTO);
        return new ResponseEntity<>(createdShowtime, HttpStatus.CREATED);
    }

@PreAuthorize("hasAuthority('SHOWTIME_DELETE')")
    @DeleteMapping("/{showtimeId}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable UUID showtimeId) {
        showtimeService.deleteShowtime(showtimeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowtimeResponseDTO>> getShowtimesByMovie(@PathVariable UUID movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
    }

    @GetMapping("/movie/{movieId}/cinema/{cinemaId}")
    public ResponseEntity<List<ShowtimeResponseDTO>> getShowtimesByMovieAndCinema(@PathVariable UUID movieId, @PathVariable Integer cinemaId) { // Thay đổi từ UUID sang Integer
        return ResponseEntity.ok(showtimeService.getShowtimesByMovieAndCinema(movieId, cinemaId));
    }

    @GetMapping("/{showtimeId}")
    public ResponseEntity<ShowtimeResponseDTO> getShowtimeById(@PathVariable UUID showtimeId) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(showtimeId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<ShowtimeResponseDTO>> getShowtimesByDate(
            @PathVariable @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        return ResponseEntity.ok(showtimeService.getShowtimesByDate(date));
    }
}
