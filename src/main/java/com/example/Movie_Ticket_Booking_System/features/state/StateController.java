package com.example.Movie_Ticket_Booking_System.features.state;

import com.example.Movie_Ticket_Booking_System.features.state.dto.ResStateDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @PostMapping
    public ResponseEntity<ResStateDTO> createState(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        State state = stateService.createState(name);
        return new ResponseEntity<>(new ResStateDTO(state), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResStateDTO> updateState(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String name = request.get("name");
        State state = stateService.updateState(id, name);
        return ResponseEntity.ok(new ResStateDTO(state));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteState(@PathVariable Integer id) {
        stateService.deleteState(id);
        return ResponseEntity.noContent().build();
    }
}
