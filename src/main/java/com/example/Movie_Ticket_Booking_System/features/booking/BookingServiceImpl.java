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
import com.example.Movie_Ticket_Booking_System.features.snack.Snack;
import com.example.Movie_Ticket_Booking_System.features.snack.SnackRepository;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.CinemaTicketPriceRepository;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.CinemaSeatPriceRepository;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.CinemaTicketPrice;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.CinemaSeatPrice;
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
    private final SnackRepository snackRepository;
    private final CinemaTicketPriceRepository cinemaTicketPriceRepository;
    private final CinemaSeatPriceRepository cinemaSeatPriceRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, AccountRepository accountRepository, ShowtimeRepository showtimeRepository, SeatRepository seatRepository, TicketTypeRepository ticketTypeRepository, SnackRepository snackRepository, CinemaTicketPriceRepository cinemaTicketPriceRepository, CinemaSeatPriceRepository cinemaSeatPriceRepository, BookingSeatRepository bookingSeatRepository) {
        this.bookingRepository = bookingRepository;
        this.accountRepository = accountRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.snackRepository = snackRepository;
        this.cinemaTicketPriceRepository = cinemaTicketPriceRepository;
        this.cinemaSeatPriceRepository = cinemaSeatPriceRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    @Override
    @Transactional
    public ResBookingDTO createBooking(ReqBookingDTO dto, String userEmail) {
        // Validation of quantities
        int totalTicketsFromQuantities = dto.getTicketQuantities().stream().mapToInt(ReqBookingDTO.TicketQuantity::getQuantity).sum();

        // Fetch entities
        Account account = accountRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "email", userEmail));
        Showtime showtime = showtimeRepository.findById(dto.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", dto.getShowtimeId()));
        List<Seat> seats = seatRepository.findByIdsWithLock(dto.getSeatIds());
        if (seats.size() != dto.getSeatIds().size()) {
            throw new ResourceNotFoundException("Seat", "id", "One or more seats not found");
        }
        
        int totalSeatCapacity = seats.stream().mapToInt(seat -> seat.getSeatType().getSeatCount() != null ? seat.getSeatType().getSeatCount() : 1).sum();
        if (totalTicketsFromQuantities != totalSeatCapacity) {
            throw new BadRequestException("The number of seats must match the total number of tickets.");
        }
        
        // Check for already booked seats
        List<BookingSeat> existingBookings = bookingSeatRepository.findByBooking_ShowtimeIdAndSeatIdIn(dto.getShowtimeId(), dto.getSeatIds());
        if (!existingBookings.isEmpty()) {
            throw new BadRequestException("One or more selected seats are already booked.");
        }

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

        Integer cinemaId = showtime.getRoom().getCinema().getId();

        for (ReqBookingDTO.TicketQuantity tq : dto.getTicketQuantities()) {
            TicketType tt = ticketTypeMap.get(tq.getTicketTypeId());
            if (tt == null) throw new ResourceNotFoundException("TicketType", "id", tq.getTicketTypeId());

            BigDecimal finalTicketPrice = tt.getBasePrice();
            java.util.Optional<CinemaTicketPrice> ctp = cinemaTicketPriceRepository.findByCinemaIdAndTicketTypeId(cinemaId, tt.getId());
            if (ctp.isPresent()) {
                finalTicketPrice = ctp.get().getPrice();
            }

            BookingTicket bt = new BookingTicket();
            bt.setBooking(booking);
            bt.setTicketType(tt);
            bt.setTicketQty(tq.getQuantity());
            bt.setPurchasePrice(finalTicketPrice); // Chốt giá tại thời điểm mua
            bookingTickets.add(bt);

            totalAmount = totalAmount.add(finalTicketPrice.multiply(new BigDecimal(tq.getQuantity())));
        }
        booking.setBookingTickets(bookingTickets);

        // Handle Snacks
        Set<BookingSnack> bookingSnacks = new HashSet<>();
        if (dto.getSnackQuantities() != null && !dto.getSnackQuantities().isEmpty()) {
            Map<Integer, Snack> snackMap = snackRepository.findAllById(
                    dto.getSnackQuantities().stream().map(ReqBookingDTO.SnackQuantity::getSnackId).toList()
            ).stream().collect(Collectors.toMap(Snack::getId, Function.identity()));

            for (ReqBookingDTO.SnackQuantity sq : dto.getSnackQuantities()) {
                Snack snack = snackMap.get(sq.getSnackId());
                if (snack == null) throw new ResourceNotFoundException("Snack", "id", sq.getSnackId());

                BookingSnack bs = new BookingSnack();
                bs.setBooking(booking);
                bs.setSnack(snack);
                bs.setSnackQty(sq.getQuantity());
                bs.setPurchasePrice(snack.getBasePrice()); // Chốt giá thời điểm mua
                bookingSnacks.add(bs);

                totalAmount = totalAmount.add(snack.getBasePrice().multiply(new BigDecimal(sq.getQuantity())));
            }
        }
        booking.setBookingSnacks(bookingSnacks);

        // Create BookingSeats and add seat surcharge
        Set<BookingSeat> bookingSeats = new HashSet<>();
        for (Seat seat : seats) {
            BookingSeat bs = new BookingSeat();
            bs.setBooking(booking);
            bs.setSeat(seat);
            bookingSeats.add(bs);

            java.util.Optional<CinemaSeatPrice> csp = cinemaSeatPriceRepository.findByCinemaIdAndSeatTypeId(cinemaId, seat.getSeatType().getId());
            if (csp.isPresent()) {
                totalAmount = totalAmount.add(csp.get().getSurcharge());
            }
        }
        booking.setBookingSeats(bookingSeats);
        booking.setTotalAmount(totalAmount);

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
        if (booking.getBookingSnacks() != null) {
            dto.setSnacks(booking.getBookingSnacks().stream()
                    .map(bs -> bs.getSnackQty() + "x " + bs.getSnack().getName())
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    @Override
    public List<Integer> getBookedSeats(java.util.UUID showtimeId) {
        return bookingSeatRepository.findBookedSeatIdsByShowtimeId(showtimeId);
    }

    @Override
    public List<com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO> getMyBookings(String userEmail) {
        List<Booking> bookings = bookingRepository.findByAccount_EmailOrderByCreatedDatetimeDesc(userEmail);
        return bookings.stream().map(this::convertToHistoryDTO).collect(Collectors.toList());
    }

    private com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO convertToHistoryDTO(Booking booking) {
        com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO dto = new com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO();
        dto.setId(booking.getId());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setCreatedDatetime(booking.getCreatedDatetime());
        
        dto.setMovieTitle(booking.getShowtime().getMovie().getTitle());
        dto.setMoviePosterUrl(booking.getShowtime().getMovie().getPosterUrl());
        dto.setCinemaName(booking.getShowtime().getRoom().getCinema().getName());
        dto.setRoomName(booking.getShowtime().getRoom().getName());
        dto.setShowtimeStartTime(booking.getShowtime().getStartTime());
        dto.setShowtimeEndTime(booking.getShowtime().getEndTime());
        
        dto.setTickets(booking.getBookingTickets().stream()
                .map(bt -> bt.getTicketQty() + "x " + bt.getTicketType().getName())
                .collect(Collectors.toList()));
        
        dto.setSeats(booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getSeatLocation())
                .collect(Collectors.toList()));
                
        if (booking.getBookingSnacks() != null) {
            dto.setSnacks(booking.getBookingSnacks().stream()
                    .map(bs -> bs.getSnackQty() + "x " + bs.getSnack().getName())
                    .collect(Collectors.toList()));
        }
        
        dto.setUsed(booking.isUsed());
        return dto;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO checkinTicket(java.util.UUID bookingId, Long cinemaId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy mã đặt vé này."));
        
        if (!"PAID".equals(booking.getPaymentStatus())) {
            throw new IllegalArgumentException("Vé này chưa được thanh toán hoặc đã bị hủy.");
        }
        
        if (cinemaId != null) {
            Integer bookingCinemaId = booking.getShowtime().getRoom().getCinema().getId();
            System.out.println("DEBUG: jwt cinemaId=" + cinemaId + " (type " + cinemaId.getClass().getName() + ")");
            System.out.println("DEBUG: bookingCinemaId=" + bookingCinemaId);
            if (cinemaId.intValue() != bookingCinemaId) {
                throw new IllegalArgumentException("Vé này thuộc Rạp ID=" + bookingCinemaId + " nhưng bạn đang quản lý Rạp ID=" + cinemaId);
            }
        }
        
        if (booking.isUsed()) {
            throw new IllegalArgumentException("Vé này ĐÃ ĐƯỢC SỬ DỤNG trước đó.");
        }
        
        booking.setUsed(true);
        bookingRepository.save(booking);
        
        return convertToHistoryDTO(booking);
    }
}
