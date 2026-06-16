package com.example.Movie_Ticket_Booking_System.features.snack;

import com.example.Movie_Ticket_Booking_System.features.snack.dto.ReqSnackDTO;
import com.example.Movie_Ticket_Booking_System.features.snack.dto.ResSnackDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/snacks")
public class SnackController {

    private final SnackService snackService;

    public SnackController(SnackService snackService) {
        this.snackService = snackService;
    }

    @GetMapping
    public ResponseEntity<List<ResSnackDTO>> getAllSnacks() {
        List<ResSnackDTO> snacks = snackService.getAllSnacks().stream()
                .map(ResSnackDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(snacks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResSnackDTO> getSnackById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ResSnackDTO(snackService.getSnackById(id)));
    }

    @PostMapping
    public ResponseEntity<ResSnackDTO> createSnack(@Valid @RequestBody ReqSnackDTO reqSnackDTO) {
        Snack snack = snackService.createSnack(reqSnackDTO);
        return new ResponseEntity<>(new ResSnackDTO(snack), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResSnackDTO> updateSnack(@PathVariable Integer id, @Valid @RequestBody ReqSnackDTO reqSnackDTO) {
        Snack snack = snackService.updateSnack(id, reqSnackDTO);
        return ResponseEntity.ok(new ResSnackDTO(snack));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSnack(@PathVariable Integer id) {
        snackService.deleteSnack(id);
        return ResponseEntity.noContent().build();
    }
}
