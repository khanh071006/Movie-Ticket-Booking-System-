package com.example.Movie_Ticket_Booking_System.features.director;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ReqDirectorDTO;
import com.example.Movie_Ticket_Booking_System.features.director.dto.ResDirectorDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DirectorServiceImpl implements DirectorService {

    private final DirectorRepository directorRepository;

    public DirectorServiceImpl(DirectorRepository directorRepository) {
        this.directorRepository = directorRepository;
    }

    @Override
    @Transactional
    public ResDirectorDTO handleCreateDirector(ReqDirectorDTO reqDirectorDTO) {
        if (directorRepository.findByName(reqDirectorDTO.getName()).isPresent()) {
            throw new DuplicateResourceException("Director", "name", reqDirectorDTO.getName());
        }

        Director director = new Director();
        director.setName(reqDirectorDTO.getName());
        director.setImageUrl(reqDirectorDTO.getImageUrl());
        director = directorRepository.save(director);
        return ResDirectorDTO.fromDirector(director);
    }

    @Override
    public List<ResDirectorDTO> handleGetAllDirectors() {
        List<Director> directors = directorRepository.findAll();
        List<ResDirectorDTO> res = new ArrayList<>();
        for (Director d : directors) {
            res.add(ResDirectorDTO.fromDirector(d));
        }
        return res;
    }

    @Override
    public ResDirectorDTO handleGetDirectorById(Integer id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Director", "id", id));
        return ResDirectorDTO.fromDirector(director);
    }

    @Override
    @Transactional
    public ResDirectorDTO handleUpdateDirector(Integer id, ReqDirectorDTO reqDirectorDTO) {
        Director existingDirector = directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Director", "id", id));

        String newName = reqDirectorDTO.getName();

        if (!existingDirector.getName().equals(newName)) {
            Optional<Director> directorWithNewName = directorRepository.findByName(newName);
            if (directorWithNewName.isPresent()) {
                throw new DuplicateResourceException("Director", "name", newName);
            }
        }
        
        existingDirector.setName(newName);
        existingDirector.setImageUrl(reqDirectorDTO.getImageUrl());
        Director updatedDirector = directorRepository.save(existingDirector);
        return ResDirectorDTO.fromDirector(updatedDirector);
    }

    @Override
    @Transactional
    public void handleDeleteDirector(Integer id) {
        if (!directorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Director", "id", id);
        }
        directorRepository.deleteById(id);
    }
}
