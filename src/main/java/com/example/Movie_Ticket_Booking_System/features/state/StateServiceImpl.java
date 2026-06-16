package com.example.Movie_Ticket_Booking_System.features.state;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StateServiceImpl implements StateService {

    private final StateRepository stateRepository;

    public StateServiceImpl(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    @Override
    public List<State> getAllStates() {
        return stateRepository.findAll();
    }

    @Override
    public State getStateById(Integer id) {
        return stateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("State", "id", id.toString()));
    }

    @Override
    public State createState(String name) {
        State state = new State();
        state.setName(name);
        return stateRepository.save(state);
    }

    @Override
    public State updateState(Integer id, String name) {
        State state = getStateById(id);
        state.setName(name);
        return stateRepository.save(state);
    }

    @Override
    public void deleteState(Integer id) {
        State state = getStateById(id);
        stateRepository.delete(state);
    }
}
