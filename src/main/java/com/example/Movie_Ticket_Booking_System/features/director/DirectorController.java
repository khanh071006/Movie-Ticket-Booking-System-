package com.example.Movie_Ticket_Booking_System.features.director;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ReqDirectorDTO;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ResDirectorDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/directors")
public class DirectorController {

    private final DirectorService directorService;

    public DirectorController(DirectorService directorService) {
        this.directorService = directorService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResDirectorDTO>> createDirector(@Valid @RequestBody ReqDirectorDTO reqDirectorDTO) {
        return ResponseEntity.status(201).body(ApiResponse.created(directorService.handleCreateDirector(reqDirectorDTO)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResDirectorDTO>>> getAllDirectors() {
        return ResponseEntity.ok(ApiResponse.success(directorService.handleGetAllDirectors()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResDirectorDTO>> getDirectorById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(directorService.handleGetDirectorById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResDirectorDTO>> updateDirector(@PathVariable UUID id, @Valid @RequestBody ReqDirectorDTO reqDirectorDTO) {
        return ResponseEntity.ok(ApiResponse.success(directorService.handleUpdateDirector(id, reqDirectorDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDirector(@PathVariable UUID id) {
        directorService.handleDeleteDirector(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }
}
