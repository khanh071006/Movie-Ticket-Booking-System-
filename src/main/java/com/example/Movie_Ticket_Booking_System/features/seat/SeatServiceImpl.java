package com.example.Movie_Ticket_Booking_System.features.seat;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.room.Room;
import com.example.Movie_Ticket_Booking_System.features.room.RoomRepository;
import com.example.Movie_Ticket_Booking_System.features.seat.dto.SeatDTO;
import com.example.Movie_Ticket_Booking_System.features.seat_type.SeatType;
import com.example.Movie_Ticket_Booking_System.features.seat_type.SeatTypeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final SeatTypeRepository seatTypeRepository;

    public SeatServiceImpl(SeatRepository seatRepository, RoomRepository roomRepository, SeatTypeRepository seatTypeRepository) {
        this.seatRepository = seatRepository;
        this.roomRepository = roomRepository;
        this.seatTypeRepository = seatTypeRepository;
    }

    @Override
    @Transactional
    public List<SeatDTO> createSeatsForRoom(Integer roomId, List<SeatDTO> seatDTOs) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

        // Delete existing seats for this room
        seatRepository.deleteByRoomId(roomId);

        // If payload is empty, just return empty list
        if (seatDTOs == null || seatDTOs.isEmpty()) {
            return new ArrayList<>();
        }

        // Fetch all required SeatTypes in one query
        List<Integer> seatTypeIds = seatDTOs.stream().map(SeatDTO::getSeatTypeId).distinct().toList();
        Map<Integer, SeatType> seatTypeMap = seatTypeRepository.findAllById(seatTypeIds).stream()
                .collect(Collectors.toMap(SeatType::getId, Function.identity()));

        List<Seat> seats = new ArrayList<>();
        for (SeatDTO dto : seatDTOs) {
            SeatType seatType = seatTypeMap.get(dto.getSeatTypeId());
            if (seatType == null) {
                throw new ResourceNotFoundException("SeatType", "id", dto.getSeatTypeId());
            }
            Seat seat = new Seat();
            seat.setSeatLocation(dto.getSeatLocation());
            seat.setSeatType(seatType);
            seat.setRoom(room);
            seats.add(seat);
        }

        List<Seat> savedSeats = seatRepository.saveAll(seats);
        return savedSeats.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<SeatDTO> getSeatsByRoom(Integer roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new ResourceNotFoundException("Room", "id", roomId);
        }
        return seatRepository.findByRoomId(roomId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SeatDTO convertToDTO(Seat seat) {
        return new SeatDTO(
                seat.getId(),
                seat.getSeatLocation(),
                seat.getSeatType().getId(),
                seat.getSeatType().getName(),
                seat.getRoom().getId(),
                seat.getSeatType().getSeatCount()
        );
    }
}
