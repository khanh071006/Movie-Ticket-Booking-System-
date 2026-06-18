package com.example.Movie_Ticket_Booking_System.features.movie;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.movie.dto.ReqMovieDTO;
import com.example.Movie_Ticket_Booking_System.features.movie.dto.ResMovieDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResMovieDTO>> createMovie(@Valid @RequestBody ReqMovieDTO reqMovieDTO) {
        Movie movie = movieService.createMovie(reqMovieDTO);
        ResMovieDTO res = new ResMovieDTO(movie);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo phim mới thành công", res));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<ResMovieDTO>>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query) {
        
        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Movie> pagedMovies = movieService.getAllMovies(page, size, query);
        
        List<ResMovieDTO> res = new ArrayList<>();
        for (Movie movie : pagedMovies.getContent()) {
            res.add(new ResMovieDTO(movie));
        }

        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<ResMovieDTO> resPage = new com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<>(
            res, pagedMovies.getPageNo(), pagedMovies.getPageSize(),
            pagedMovies.getTotalElements(), pagedMovies.getTotalPages(), pagedMovies.isLast()
        );

        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phim thành công", resPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResMovieDTO>> getMovieById(@PathVariable UUID id) {
        Movie movie = movieService.getMovieById(id);
        ResMovieDTO res = new ResMovieDTO(movie);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin phim thành công", res));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResMovieDTO>> updateMovie(@PathVariable UUID id, @Valid @RequestBody ReqMovieDTO reqMovieDTO) {
        Movie movie = movieService.updateMovie(id, reqMovieDTO);
        ResMovieDTO res = new ResMovieDTO(movie);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin phim thành công", res));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable UUID id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phim thành công", null));
    }
}
