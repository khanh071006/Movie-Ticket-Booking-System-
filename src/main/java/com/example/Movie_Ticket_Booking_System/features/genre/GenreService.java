package com.example.Movie_Ticket_Booking_System.features.genre;

import com.example.Movie_Ticket_Booking_System.features.genre.dto.ReqGenreDTO;
import com.example.Movie_Ticket_Booking_System.features.genre.dto.ResGenreDTO;

import java.util.List;

public interface GenreService {
    ResGenreDTO handleCreateGenre(ReqGenreDTO reqGenreDTO);
    List<ResGenreDTO> handleGetAllGenres();
    ResGenreDTO handleGetGenreById(Integer id);
    ResGenreDTO handleUpdateGenre(Integer id, ReqGenreDTO reqGenreDTO);
    void handleDeleteGenre(Integer id);
}
