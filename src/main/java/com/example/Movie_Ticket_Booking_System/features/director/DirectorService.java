package com.example.Movie_Ticket_Booking_System.features.director;

import com.example.Movie_Ticket_Booking_System.features.director.dto.ReqDirectorDTO;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ResDirectorDTO;

import java.util.List;
import java.util.UUID;

public interface DirectorService {
    ResDirectorDTO handleCreateDirector(ReqDirectorDTO reqDirectorDTO);
    List<ResDirectorDTO> handleGetAllDirectors();
    ResDirectorDTO handleGetDirectorById(UUID id);
    ResDirectorDTO handleUpdateDirector(UUID id, ReqDirectorDTO reqDirectorDTO);
    void handleDeleteDirector(UUID id);
}
