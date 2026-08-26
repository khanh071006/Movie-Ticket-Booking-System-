package com.example.Movie_Ticket_Booking_System.features.state;

import com.example.Movie_Ticket_Booking_System.features.state.dto.ResStateDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/states")
public class StateController {

    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping
    public ResponseEntity<List<ResStateDTO>> getAllStates() {
        List<ResStateDTO> states = stateService.getAllStates().stream()
                .map(ResStateDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(states);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResStateDTO> getStateById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ResStateDTO(stateService.getStateById(id)));
    }

@PreAuthorize("hasAuthority('CONFIG_CREATE')")
    @PostMapping
    public ResponseEntity<ResStateDTO> createState(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        State state = stateService.createState(name);
        return new ResponseEntity<>(new ResStateDTO(state), HttpStatus.CREATED);
    }

@PreAuthorize("hasAuthority('CONFIG_UPDATE')")
    @PutMapping("/{id}")
    public ResponseEntity<ResStateDTO> updateState(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String name = request.get("name");
        State state = stateService.updateState(id, name);
        return ResponseEntity.ok(new ResStateDTO(state));
    }

@PreAuthorize("hasAuthority('CONFIG_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteState(@PathVariable Integer id) {
        stateService.deleteState(id);
        return ResponseEntity.noContent().build();
    }
}
