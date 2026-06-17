package com.example.Movie_Ticket_Booking_System.features.ticket_type;

import com.example.Movie_Ticket_Booking_System.features.ticket_type.dto.TicketTypeDTO;

import java.util.List;

public interface TicketTypeService {
    TicketTypeDTO createTicketType(TicketTypeDTO ticketTypeDTO);
    TicketTypeDTO updateTicketType(Integer id, TicketTypeDTO ticketTypeDTO);
    void deleteTicketType(Integer id);
    List<TicketTypeDTO> getAllTicketTypes();
}
