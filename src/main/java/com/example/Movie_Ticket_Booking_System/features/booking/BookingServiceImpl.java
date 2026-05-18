package com.example.Movie_Ticket_Booking_System.features.booking;

import com.example.Movie_Ticket_Booking_System.exception.BadRequestException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountRepository;
import com.example.Movie_Ticket_Booking_System.features.booking.dto.ReqBookingDTO;
import com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingDTO;
import com.example.Movie_Ticket_Booking_System.features.seat.Seat;
import com.example.Movie_Ticket_Booking_System.features.seat.SeatRepository;
import com.example.Movie_Ticket_Booking_System.features.showtime.Showtime;
import com.example.Movie_Ticket_Booking_System.features.showtime.ShowtimeRepository;
import com.example.Movie_Ticket_Booking_System.features.ticket_type.TicketType;
import com.example.Movie_Ticket_Booking_System.features.ticket_type.TicketTypeRepository;
import com.example.Movie_Ticket_Booking_System.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final AccountRepository accountRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketTypeRepository ticketTypeRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, AccountRepository accountRepository, ShowtimeRepository showtimeRepository, SeatRepository seatRepository, TicketTypeRepository ticketTypeRepository) {
        this.bookingRepository = bookingRepository;
        this.accountRepository = accountRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.ticketTypeRepository = ticketTypeRepository;
    }

    @Override
    @Transactional
    public ResBookingDTO createBooking(ReqBookingDTO dto, UserPrincipal principal) {
        // Validation
        int totalTicketsFromQuantities = dto.getTicketQuantities().stream().mapToInt(ReqBookingDTO.TicketQuantity::getQuantity).sum();
        if (totalTicketsFromQuantities != dto.getSeatIds().size()) {
            throw new BadRequestException("The number of seats must match the total number of tickets.");
        }

        // Fetch entities
        Account account = accountRepository.findById(principal.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", principal.getAccountId()));
        Showtime showtime = showtimeRepository.findById(dto.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", dto.getShowtimeId()));
        List<Seat> seats = seatRepository.findAllById(dto.getSeatIds());
        if (seats.size() != dto.getSeatIds().size()) {
            throw new ResourceNotFoundException("Seat", "id", "One or more seats not found");
        }
        // TODO: Check for already booked seats

        // Create Booking
        Booking booking = new Booking();
        booking.setAccount(account);
        booking.setShowtime(showtime);
        booking.setCreatedDatetime(LocalDateTime.now());
        booking.setPaymentStatus("PENDING");

        // Create BookingTickets and calculate total price
        Set<BookingTicket> bookingTickets = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        Map<Integer, TicketType> ticketTypeMap = ticketTypeRepository.findAllById(
                dto.getTicketQuantities().stream().map(ReqBookingDTO.TicketQuantity::getTicketTypeId).toList()
        ).stream().collect(Collectors.toMap(TicketType::getId, Function.identity()));

        for (ReqBookingDTO.TicketQuantity tq : dto.getTicketQuantities()) {
            TicketType tt = ticketTypeMap.get(tq.getTicketTypeId());
            if (tt == null) throw new ResourceNotFoundException("TicketType", "id", tq.getTicketTypeId());

            BookingTicket bt = new BookingTicket();
            bt.setBooking(booking);
            bt.setTicketType(tt);
            bt.setTicketQty(tq.getQuantity());
            bt.setPurchasePrice(tt.getBasePrice()); // Chốt giá tại thời điểm mua
            bookingTickets.add(bt);

            totalAmount = totalAmount.add(tt.getBasePrice().multiply(new BigDecimal(tq.getQuantity())));
        }
        booking.setBookingTickets(bookingTickets);
        booking.setTotalAmount(totalAmount);

        // Create BookingSeats
        Set<BookingSeat> bookingSeats = new HashSet<>();
        for (Seat seat : seats) {
            BookingSeat bs = new BookingSeat();
            bs.setBooking(booking);
            bs.setSeat(seat);
            bookingSeats.add(bs);
        }
        booking.setBookingSeats(bookingSeats);

        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    private ResBookingDTO convertToDTO(Booking booking) {
        ResBookingDTO dto = new ResBookingDTO();
        dto.setId(booking.getId());
        dto.setShowtimeId(booking.getShowtime().getId());
        dto.setMovieTitle(booking.getShowtime().getMovie().getTitle());
        dto.setBookingTime(booking.getCreatedDatetime());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setSeatLocations(booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getSeatLocation())
                .collect(Collectors.toList()));
        dto.setTickets(booking.getBookingTickets().stream()
                .map(bt -> bt.getTicketQty() + "x " + bt.getTicketType().getName())
                .collect(Collectors.toList()));
        return dto;
    }
}
