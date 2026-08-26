package com.example.Movie_Ticket_Booking_System.features.director;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ReqDirectorDTO;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ResDirectorDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/directors")
public class DirectorController {

    private final DirectorService directorService;

    public DirectorController(DirectorService directorService) {
        this.directorService = directorService;
    }

@PreAuthorize("hasAuthority('CATEGORY_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<ResDirectorDTO>> createDirector(@Valid @RequestBody ReqDirectorDTO reqDirectorDTO) {
        return ResponseEntity.status(201).body(ApiResponse.created(directorService.handleCreateDirector(reqDirectorDTO)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResDirectorDTO>>> getAllDirectors() {
        return ResponseEntity.ok(ApiResponse.success(directorService.handleGetAllDirectors()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResDirectorDTO>> getDirectorById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(directorService.handleGetDirectorById(id)));
    }

@PreAuthorize("hasAuthority('CATEGORY_UPDATE')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResDirectorDTO>> updateDirector(@PathVariable Integer id, @Valid @RequestBody ReqDirectorDTO reqDirectorDTO) {
        return ResponseEntity.ok(ApiResponse.success(directorService.handleUpdateDirector(id, reqDirectorDTO)));
    }

@PreAuthorize("hasAuthority('CATEGORY_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDirector(@PathVariable Integer id) {
        directorService.handleDeleteDirector(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }
}
