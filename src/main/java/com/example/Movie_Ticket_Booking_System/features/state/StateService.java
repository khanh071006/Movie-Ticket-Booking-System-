package com.example.Movie_Ticket_Booking_System.features.state;

import java.util.List;

public interface StateService {
    List<State> getAllStates();
    State getStateById(Integer id);
    State createState(String name);
    State updateState(Integer id, String name);
    void deleteState(Integer id);
}
