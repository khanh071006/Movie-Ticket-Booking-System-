package com.example.Movie_Ticket_Booking_System.features.snack_type;

import com.example.Movie_Ticket_Booking_System.features.snack_type.dto.ResSnackTypeDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/snack-types")
public class SnackTypeController {

    private final SnackTypeService snackTypeService;

    public SnackTypeController(SnackTypeService snackTypeService) {
        this.snackTypeService = snackTypeService;
    }

    @GetMapping
    public ResponseEntity<List<ResSnackTypeDTO>> getAllSnackTypes() {
        List<ResSnackTypeDTO> snackTypes = snackTypeService.getAllSnackTypes().stream()
                .map(ResSnackTypeDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(snackTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResSnackTypeDTO> getSnackTypeById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ResSnackTypeDTO(snackTypeService.getSnackTypeById(id)));
    }

@PreAuthorize("hasAuthority('CONFIG_CREATE')")
    @PostMapping
    public ResponseEntity<ResSnackTypeDTO> createSnackType(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        SnackType snackType = snackTypeService.createSnackType(name);
        return new ResponseEntity<>(new ResSnackTypeDTO(snackType), HttpStatus.CREATED);
    }

@PreAuthorize("hasAuthority('CONFIG_UPDATE')")
    @PutMapping("/{id}")
    public ResponseEntity<ResSnackTypeDTO> updateSnackType(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String name = request.get("name");
        SnackType snackType = snackTypeService.updateSnackType(id, name);
        return ResponseEntity.ok(new ResSnackTypeDTO(snackType));
    }

@PreAuthorize("hasAuthority('CONFIG_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSnackType(@PathVariable Integer id) {
        snackTypeService.deleteSnackType(id);
        return ResponseEntity.noContent().build();
    }
}
