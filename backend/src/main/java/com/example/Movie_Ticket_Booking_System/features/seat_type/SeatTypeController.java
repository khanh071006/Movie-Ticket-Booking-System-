package com.example.Movie_Ticket_Booking_System.features.seat_type;

import com.example.Movie_Ticket_Booking_System.features.seat_type.dto.SeatTypeDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/seat-types")
public class SeatTypeController {

    private final SeatTypeService seatTypeService;

    public SeatTypeController(SeatTypeService seatTypeService) {
        this.seatTypeService = seatTypeService;
    }

@PreAuthorize("hasAuthority('CONFIG_CREATE')")
    @PostMapping
    public ResponseEntity<SeatTypeDTO> createSeatType(@Valid @RequestBody SeatTypeDTO seatTypeDTO) {
        SeatTypeDTO createdSeatType = seatTypeService.createSeatType(seatTypeDTO);
        return new ResponseEntity<>(createdSeatType, HttpStatus.CREATED);
    }

@PreAuthorize("hasAuthority('CONFIG_UPDATE')")
    @PutMapping("/{id}")
    public ResponseEntity<SeatTypeDTO> updateSeatType(@PathVariable Integer id, @Valid @RequestBody SeatTypeDTO seatTypeDTO) {
        return ResponseEntity.ok(seatTypeService.updateSeatType(id, seatTypeDTO));
    }

@PreAuthorize("hasAuthority('CONFIG_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeatType(@PathVariable Integer id) {
        seatTypeService.deleteSeatType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SeatTypeDTO>> getAllSeatTypes() {
        return ResponseEntity.ok(seatTypeService.getAllSeatTypes());
    }
}
