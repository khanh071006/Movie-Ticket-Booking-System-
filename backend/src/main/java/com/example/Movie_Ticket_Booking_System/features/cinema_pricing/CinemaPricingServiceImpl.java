package com.example.Movie_Ticket_Booking_System.features.cinema_pricing;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.cinema.Cinema;
import com.example.Movie_Ticket_Booking_System.features.cinema.CinemaRepository;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto.ReqCinemaPricingDTO;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto.ResCinemaPricingDTO;
import com.example.Movie_Ticket_Booking_System.features.seat_type.SeatType;
import com.example.Movie_Ticket_Booking_System.features.seat_type.SeatTypeRepository;
import com.example.Movie_Ticket_Booking_System.features.ticket_type.TicketType;
import com.example.Movie_Ticket_Booking_System.features.ticket_type.TicketTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CinemaPricingServiceImpl implements CinemaPricingService {

    private final CinemaRepository cinemaRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final SeatTypeRepository seatTypeRepository;
    private final CinemaTicketPriceRepository ticketPriceRepository;
    private final CinemaSeatPriceRepository seatPriceRepository;

    public CinemaPricingServiceImpl(CinemaRepository cinemaRepository,
                                    TicketTypeRepository ticketTypeRepository,
                                    SeatTypeRepository seatTypeRepository,
                                    CinemaTicketPriceRepository ticketPriceRepository,
                                    CinemaSeatPriceRepository seatPriceRepository) {
        this.cinemaRepository = cinemaRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.seatTypeRepository = seatTypeRepository;
        this.ticketPriceRepository = ticketPriceRepository;
        this.seatPriceRepository = seatPriceRepository;
    }

    @Override
    public ResCinemaPricingDTO getPricingByCinemaId(Integer cinemaId) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", cinemaId));

        List<CinemaTicketPrice> ticketPrices = ticketPriceRepository.findByCinemaId(cinemaId);
        List<CinemaSeatPrice> seatPrices = seatPriceRepository.findByCinemaId(cinemaId);

        ResCinemaPricingDTO res = new ResCinemaPricingDTO();
        res.setCinemaId(cinema.getId().toString());

        res.setTicketPrices(ticketPrices.stream().map(tp -> {
            ResCinemaPricingDTO.TicketPriceDTO dto = new ResCinemaPricingDTO.TicketPriceDTO();
            dto.setTicketTypeId(tp.getTicketType().getId());
            dto.setTicketTypeName(tp.getTicketType().getName());
            dto.setPrice(tp.getPrice());
            return dto;
        }).collect(Collectors.toList()));

        res.setSeatPrices(seatPrices.stream().map(sp -> {
            ResCinemaPricingDTO.SeatPriceDTO dto = new ResCinemaPricingDTO.SeatPriceDTO();
            dto.setSeatTypeId(sp.getSeatType().getId());
            dto.setSeatTypeName(sp.getSeatType().getName());
            dto.setSurcharge(sp.getSurcharge());
            return dto;
        }).collect(Collectors.toList()));

        return res;
    }

    @Override
    @Transactional
    public ResCinemaPricingDTO updatePricing(Integer cinemaId, ReqCinemaPricingDTO dto) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", cinemaId));

        // Update Ticket Prices
        ticketPriceRepository.deleteByCinemaId(cinemaId);
        if (dto.getTicketPrices() != null) {
            for (ReqCinemaPricingDTO.TicketPriceDTO tpDto : dto.getTicketPrices()) {
                TicketType ticketType = ticketTypeRepository.findById(tpDto.getTicketTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException("TicketType", "id", tpDto.getTicketTypeId()));
                CinemaTicketPrice ctp = new CinemaTicketPrice();
                ctp.setCinema(cinema);
                ctp.setTicketType(ticketType);
                ctp.setPrice(tpDto.getPrice());
                ticketPriceRepository.save(ctp);
            }
        }

        // Update Seat Prices
        seatPriceRepository.deleteByCinemaId(cinemaId);
        if (dto.getSeatPrices() != null) {
            for (ReqCinemaPricingDTO.SeatPriceDTO spDto : dto.getSeatPrices()) {
                SeatType seatType = seatTypeRepository.findById(spDto.getSeatTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException("SeatType", "id", spDto.getSeatTypeId()));
                CinemaSeatPrice csp = new CinemaSeatPrice();
                csp.setCinema(cinema);
                csp.setSeatType(seatType);
                csp.setSurcharge(spDto.getSurcharge());
                seatPriceRepository.save(csp);
            }
        }

        return getPricingByCinemaId(cinemaId);
    }
}
