package com.example.Movie_Ticket_Booking_System.features.moviestatus;

import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ReqMovieStatusDTO;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ResMovieStatusDTO;

import java.util.List;

public interface MovieStatusService {
    ResMovieStatusDTO handleCreateMovieStatus(ReqMovieStatusDTO reqMovieStatusDTO);
    List<ResMovieStatusDTO> handleGetAllMovieStatuses();
    ResMovieStatusDTO handleGetMovieStatusById(Integer id);
    ResMovieStatusDTO handleUpdateMovieStatus(Integer id, ReqMovieStatusDTO reqMovieStatusDTO);
    void handleDeleteMovieStatus(Integer id);
}
