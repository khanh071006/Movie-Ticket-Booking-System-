package com.example.Movie_Ticket_Booking_System.features.genre;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.genre.dto.ReqGenreDTO;
import com.example.Movie_Ticket_Booking_System.features.genre.dto.ResGenreDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/genres")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResGenreDTO>> createGenre(@Valid @RequestBody ReqGenreDTO reqGenreDTO) {
        return ResponseEntity.status(201).body(ApiResponse.created(genreService.handleCreateGenre(reqGenreDTO)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResGenreDTO>>> getAllGenres() {
        return ResponseEntity.ok(ApiResponse.success(genreService.handleGetAllGenres()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResGenreDTO>> getGenreById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(genreService.handleGetGenreById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResGenreDTO>> updateGenre(@PathVariable Integer id, @Valid @RequestBody ReqGenreDTO reqGenreDTO) {
        return ResponseEntity.ok(ApiResponse.success(genreService.handleUpdateGenre(id, reqGenreDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGenre(@PathVariable Integer id) {
        genreService.handleDeleteGenre(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }
}
