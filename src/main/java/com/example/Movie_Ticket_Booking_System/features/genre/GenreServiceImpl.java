package com.example.Movie_Ticket_Booking_System.features.genre;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.genre.dto.ReqGenreDTO;
import com.example.Movie_Ticket_Booking_System.features.genre.dto.ResGenreDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;

    public GenreServiceImpl(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @Override
    @Transactional
    public ResGenreDTO handleCreateGenre(ReqGenreDTO reqGenreDTO) {
        if (genreRepository.findByName(reqGenreDTO.getName()).isPresent()) {
            throw new DuplicateResourceException("Genre", "name", reqGenreDTO.getName());
        }
        Genre genre = new Genre();
        genre.setName(reqGenreDTO.getName());
        genre = genreRepository.save(genre);
        return ResGenreDTO.fromGenre(genre);
    }

    @Override
    public List<ResGenreDTO> handleGetAllGenres() {
        List<Genre> genres = genreRepository.findAll();
        List<ResGenreDTO> res = new ArrayList<>();
        for (Genre g : genres) {
            res.add(ResGenreDTO.fromGenre(g));
        }
        return res;
    }

    @Override
    public ResGenreDTO handleGetGenreById(UUID id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genre", "id", id));
        return ResGenreDTO.fromGenre(genre);
    }

    @Override
    @Transactional
    public ResGenreDTO handleUpdateGenre(UUID id, ReqGenreDTO reqGenreDTO) {
        Genre existingGenre = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genre", "id", id));

        String newName = reqGenreDTO.getName();

        if (!existingGenre.getName().equals(newName)) {
            Optional<Genre> genreWithNewName = genreRepository.findByName(newName);
            if (genreWithNewName.isPresent()) {
                throw new DuplicateResourceException("Genre", "name", newName);
            }
            existingGenre.setName(newName);
        }

        Genre updatedGenre = genreRepository.save(existingGenre);
        return ResGenreDTO.fromGenre(updatedGenre);
    }

    @Override
    @Transactional
    public void handleDeleteGenre(UUID id) {
        if (!genreRepository.existsById(id)) {
            throw new ResourceNotFoundException("Genre", "id", id);
        }
        genreRepository.deleteById(id);
    }
}
