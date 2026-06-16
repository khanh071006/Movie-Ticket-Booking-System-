package com.example.Movie_Ticket_Booking_System.features.director;

import com.example.Movie_Ticket_Booking_System.features.director.dto.ReqDirectorDTO;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ResDirectorDTO;

import java.util.List;

public interface DirectorService {
    ResDirectorDTO handleCreateDirector(ReqDirectorDTO reqDirectorDTO);
    List<ResDirectorDTO> handleGetAllDirectors();
    ResDirectorDTO handleGetDirectorById(Integer id);
    ResDirectorDTO handleUpdateDirector(Integer id, ReqDirectorDTO reqDirectorDTO);
    void handleDeleteDirector(Integer id);
}
