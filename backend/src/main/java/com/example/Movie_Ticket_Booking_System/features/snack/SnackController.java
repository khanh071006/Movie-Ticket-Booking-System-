package com.example.Movie_Ticket_Booking_System.features.snack;

import com.example.Movie_Ticket_Booking_System.features.snack.dto.ReqSnackDTO;
import com.example.Movie_Ticket_Booking_System.features.snack.dto.ResSnackDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/snacks")
public class SnackController {

    private final SnackService snackService;

    public SnackController(SnackService snackService) {
        this.snackService = snackService;
    }

    @GetMapping
    public ResponseEntity<com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<ResSnackDTO>> getAllSnacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Snack> pagedSnacks = snackService.getAllSnacks(page, size);
        List<ResSnackDTO> dtos = pagedSnacks.getContent().stream()
            .map(ResSnackDTO::new)
            .collect(Collectors.toList());
        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<ResSnackDTO> resPage = new com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<>(
            dtos, pagedSnacks.getPageNo(), pagedSnacks.getPageSize(),
            pagedSnacks.getTotalElements(), pagedSnacks.getTotalPages(), pagedSnacks.isLast()
        );
        return ResponseEntity.ok(resPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResSnackDTO> getSnackById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ResSnackDTO(snackService.getSnackById(id)));
    }

@PreAuthorize("hasAuthority('SNACK_CREATE')")
    @PostMapping
    public ResponseEntity<ResSnackDTO> createSnack(@Valid @RequestBody ReqSnackDTO reqSnackDTO) {
        Snack snack = snackService.createSnack(reqSnackDTO);
        return new ResponseEntity<>(new ResSnackDTO(snack), HttpStatus.CREATED);
    }

@PreAuthorize("hasAuthority('SNACK_UPDATE')")
    @PutMapping("/{id}")
    public ResponseEntity<ResSnackDTO> updateSnack(@PathVariable Integer id, @Valid @RequestBody ReqSnackDTO reqSnackDTO) {
        Snack snack = snackService.updateSnack(id, reqSnackDTO);
        return ResponseEntity.ok(new ResSnackDTO(snack));
    }

@PreAuthorize("hasAuthority('SNACK_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSnack(@PathVariable Integer id) {
        snackService.deleteSnack(id);
        return ResponseEntity.noContent().build();
    }
}
