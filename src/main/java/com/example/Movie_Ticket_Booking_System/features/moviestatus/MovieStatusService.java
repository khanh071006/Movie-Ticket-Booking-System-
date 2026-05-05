package com.example.Movie_Ticket_Booking_System.features.moviestatus;

import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ReqMovieStatusDTO;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ResMovieStatusDTO;

import java.util.List;
import java.util.UUID;

public interface MovieStatusService {
    ResMovieStatusDTO handleCreateMovieStatus(ReqMovieStatusDTO reqMovieStatusDTO);
    List<ResMovieStatusDTO> handleGetAllMovieStatuses();
    ResMovieStatusDTO handleGetMovieStatusById(UUID id);
    ResMovieStatusDTO handleUpdateMovieStatus(UUID id, ReqMovieStatusDTO reqMovieStatusDTO);
    void handleDeleteMovieStatus(UUID id);
}
