package com.example.Movie_Ticket_Booking_System.features.moviestatus;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ReqMovieStatusDTO;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ResMovieStatusDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/movie-statuses")
public class MovieStatusController {

    private final MovieStatusService movieStatusService;

    public MovieStatusController(MovieStatusService movieStatusService) {
        this.movieStatusService = movieStatusService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResMovieStatusDTO>> createMovieStatus(@Valid @RequestBody ReqMovieStatusDTO reqMovieStatusDTO) {
        return ResponseEntity.status(201).body(ApiResponse.created(movieStatusService.handleCreateMovieStatus(reqMovieStatusDTO)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResMovieStatusDTO>>> getAllMovieStatuses() {
        return ResponseEntity.ok(ApiResponse.success(movieStatusService.handleGetAllMovieStatuses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResMovieStatusDTO>> getMovieStatusById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(movieStatusService.handleGetMovieStatusById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResMovieStatusDTO>> updateMovieStatus(@PathVariable UUID id, @Valid @RequestBody ReqMovieStatusDTO reqMovieStatusDTO) {
        return ResponseEntity.ok(ApiResponse.success(movieStatusService.handleUpdateMovieStatus(id, reqMovieStatusDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovieStatus(@PathVariable UUID id) {
        movieStatusService.handleDeleteMovieStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }
}
