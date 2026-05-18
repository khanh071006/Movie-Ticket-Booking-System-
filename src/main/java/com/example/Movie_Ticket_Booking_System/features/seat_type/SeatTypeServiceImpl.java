package com.example.Movie_Ticket_Booking_System.features.seat_type;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.seat_type.dto.SeatTypeDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatTypeServiceImpl implements SeatTypeService {

    private final SeatTypeRepository seatTypeRepository;

    public SeatTypeServiceImpl(SeatTypeRepository seatTypeRepository) {
        this.seatTypeRepository = seatTypeRepository;
    }

    @Override
    public SeatTypeDTO createSeatType(SeatTypeDTO seatTypeDTO) {
        seatTypeRepository.findByName(seatTypeDTO.getName()).ifPresent(st -> {
            throw new DuplicateResourceException("SeatType", "name", st.getName());
        });
        SeatType seatType = new SeatType();
        seatType.setName(seatTypeDTO.getName());
        SeatType savedSeatType = seatTypeRepository.save(seatType);
        return convertToDTO(savedSeatType);
    }

    @Override
    public SeatTypeDTO updateSeatType(Integer id, SeatTypeDTO seatTypeDTO) {
        SeatType seatType = seatTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SeatType", "id", id));
        seatTypeRepository.findByName(seatTypeDTO.getName()).ifPresent(st -> {
            if (!st.getId().equals(id)) {
                throw new DuplicateResourceException("SeatType", "name", st.getName());
            }
        });
        seatType.setName(seatTypeDTO.getName());
        SeatType updatedSeatType = seatTypeRepository.save(seatType);
        return convertToDTO(updatedSeatType);
    }

    @Override
    public void deleteSeatType(Integer id) {
        if (!seatTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("SeatType", "id", id);
        }
        // TODO: Add check if any seat is using this type
        seatTypeRepository.deleteById(id);
    }

    @Override
    public List<SeatTypeDTO> getAllSeatTypes() {
        return seatTypeRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private SeatTypeDTO convertToDTO(SeatType seatType) {
        return new SeatTypeDTO(seatType.getId(), seatType.getName());
    }
}
