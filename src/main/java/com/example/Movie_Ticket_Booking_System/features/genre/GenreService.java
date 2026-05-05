package com.example.Movie_Ticket_Booking_System.features.genre;

import com.example.Movie_Ticket_Booking_System.features.genre.dto.ReqGenreDTO;
import com.example.Movie_Ticket_Booking_System.features.genre.dto.ResGenreDTO;

import java.util.List;
import java.util.UUID;

public interface GenreService {
    ResGenreDTO handleCreateGenre(ReqGenreDTO reqGenreDTO);
    List<ResGenreDTO> handleGetAllGenres();
    ResGenreDTO handleGetGenreById(UUID id);
    ResGenreDTO handleUpdateGenre(UUID id, ReqGenreDTO reqGenreDTO);
    void handleDeleteGenre(UUID id);
}
