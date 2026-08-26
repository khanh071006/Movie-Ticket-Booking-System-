package com.example.Movie_Ticket_Booking_System.features.ticket_type;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.ticket_type.dto.TicketTypeDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketTypeServiceImpl implements TicketTypeService {

    private final TicketTypeRepository ticketTypeRepository;

    public TicketTypeServiceImpl(TicketTypeRepository ticketTypeRepository) {
        this.ticketTypeRepository = ticketTypeRepository;
    }

    @Override
    public TicketTypeDTO createTicketType(TicketTypeDTO dto) {
        ticketTypeRepository.findByName(dto.getName()).ifPresent(tt -> {
            throw new DuplicateResourceException("TicketType", "name", tt.getName());
        });
        TicketType ticketType = new TicketType();
        ticketType.setName(dto.getName());
        ticketType.setBasePrice(dto.getBasePrice());
        TicketType saved = ticketTypeRepository.save(ticketType);
        return convertToDTO(saved);
    }

    @Override
    public TicketTypeDTO updateTicketType(Integer id, TicketTypeDTO dto) {
        TicketType ticketType = ticketTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TicketType", "id", id));
        ticketTypeRepository.findByName(dto.getName()).ifPresent(tt -> {
            if (!tt.getId().equals(id)) {
                throw new DuplicateResourceException("TicketType", "name", tt.getName());
            }
        });
        ticketType.setName(dto.getName());
        ticketType.setBasePrice(dto.getBasePrice());
        TicketType updated = ticketTypeRepository.save(ticketType);
        return convertToDTO(updated);
    }

    @Override
    public void deleteTicketType(Integer id) {
        if (!ticketTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("TicketType", "id", id);
        }
        // TODO: Add check if any booking_ticket is using this type
        ticketTypeRepository.deleteById(id);
    }

    @Override
    public List<TicketTypeDTO> getAllTicketTypes() {
        return ticketTypeRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private TicketTypeDTO convertToDTO(TicketType ticketType) {
        return new TicketTypeDTO(ticketType.getId(), ticketType.getName(), ticketType.getBasePrice());
    }
}
