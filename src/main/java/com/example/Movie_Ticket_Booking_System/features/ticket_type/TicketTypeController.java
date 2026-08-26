package com.example.Movie_Ticket_Booking_System.features.ticket_type;

import com.example.Movie_Ticket_Booking_System.features.ticket_type.dto.TicketTypeDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/ticket-types")
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;

    public TicketTypeController(TicketTypeService ticketTypeService) {
        this.ticketTypeService = ticketTypeService;
    }

@PreAuthorize("hasAuthority('CONFIG_CREATE')")
    @PostMapping
    public ResponseEntity<TicketTypeDTO> createTicketType(@Valid @RequestBody TicketTypeDTO dto) {
        TicketTypeDTO created = ticketTypeService.createTicketType(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

@PreAuthorize("hasAuthority('CONFIG_UPDATE')")
    @PutMapping("/{id}")
    public ResponseEntity<TicketTypeDTO> updateTicketType(@PathVariable Integer id, @Valid @RequestBody TicketTypeDTO dto) {
        return ResponseEntity.ok(ticketTypeService.updateTicketType(id, dto));
    }

@PreAuthorize("hasAuthority('CONFIG_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketType(@PathVariable Integer id) {
        ticketTypeService.deleteTicketType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<TicketTypeDTO>> getAllTicketTypes() {
        return ResponseEntity.ok(ticketTypeService.getAllTicketTypes());
    }
}
