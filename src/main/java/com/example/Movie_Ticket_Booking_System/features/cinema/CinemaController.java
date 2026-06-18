package com.example.Movie_Ticket_Booking_System.features.cinema;

import com.example.Movie_Ticket_Booking_System.features.cinema.dto.CinemaDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/cinemas")
public class CinemaController {

    private final CinemaService cinemaService;

    public CinemaController(CinemaService cinemaService) {
        this.cinemaService = cinemaService;
    }

    @GetMapping
    public ResponseEntity<com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<CinemaDTO>> getAllCinemas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Cinema> pagedCinemas = cinemaService.getAllCinemas(page, size);
        
        List<CinemaDTO> resList = new ArrayList<>();
        for (Cinema c : pagedCinemas.getContent()) {
            resList.add(new CinemaDTO(c.getId(), c.getName(), c.getAddress(), c.getCity(), 
                c.getState() != null ? c.getState().getId() : null, 
                c.getState() != null ? c.getState().getName() : null));
        }
        
        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<CinemaDTO> resPage = new com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<>(
            resList, pagedCinemas.getPageNo(), pagedCinemas.getPageSize(),
            pagedCinemas.getTotalElements(), pagedCinemas.getTotalPages(), pagedCinemas.isLast()
        );
        return ResponseEntity.ok(resPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CinemaDTO> getCinemaById(@PathVariable Integer id) {
        return ResponseEntity.ok(cinemaService.getCinemaById(id));
    }

    @PostMapping
    public ResponseEntity<CinemaDTO> createCinema(@Valid @RequestBody CinemaDTO cinemaDTO) {
        CinemaDTO createdCinema = cinemaService.createCinema(cinemaDTO);
        return new ResponseEntity<>(createdCinema, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CinemaDTO> updateCinema(@PathVariable Integer id, @Valid @RequestBody CinemaDTO cinemaDTO) {
        return ResponseEntity.ok(cinemaService.updateCinema(id, cinemaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCinema(@PathVariable Integer id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}
