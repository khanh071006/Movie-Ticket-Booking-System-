package com.example.Movie_Ticket_Booking_System.features.room;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.cinema.Cinema;
import com.example.Movie_Ticket_Booking_System.features.cinema.CinemaRepository;
import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomDTO;
import com.example.Movie_Ticket_Booking_System.features.showtime.Showtime;
import com.example.Movie_Ticket_Booking_System.features.showtime.ShowtimeRepository;
import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountRepository;
import com.example.Movie_Ticket_Booking_System.security.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final ShowtimeRepository showtimeRepository;
    private final AccountRepository accountRepository;

    public RoomServiceImpl(RoomRepository roomRepository, CinemaRepository cinemaRepository, ShowtimeRepository showtimeRepository, AccountRepository accountRepository) {
        this.roomRepository = roomRepository;
        this.cinemaRepository = cinemaRepository;
        this.showtimeRepository = showtimeRepository;
        this.accountRepository = accountRepository;
    }

    private void checkCinemaAccess(Integer targetCinemaId) {
        String currentUserEmail = SecurityUtil.getCurrentUserLogin().orElse(null);
        if (currentUserEmail != null) {
            Account account = accountRepository.findByEmail(currentUserEmail).orElse(null);
            if (account != null) {
                boolean isSuperAdmin = account.getAccountRoles().stream()
                        .anyMatch(r -> r.getRole().getName().equals("ROLE_SUPERADMIN"));
                if (!isSuperAdmin) {
                    if (account.getCinema() == null || !account.getCinema().getId().equals(targetCinemaId)) {
                        throw new RuntimeException("Bạn không có quyền thao tác trên Rạp chiếu này.");
                    }
                }
            }
        }
    }

    @Override
    public List<RoomDTO> getAllRoomsByCinema(Integer cinemaId) {
        if (!cinemaRepository.existsById(cinemaId)) {
            throw new ResourceNotFoundException("Cinema", "id", cinemaId);
        }
        return roomRepository.findByCinemaId(cinemaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RoomDTO createRoom(RoomDTO roomDTO) {
        Cinema cinema = cinemaRepository.findById(roomDTO.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", roomDTO.getCinemaId()));
        
        checkCinemaAccess(cinema.getId());

        Room room = new Room();
        room.setName(roomDTO.getName());
        room.setCinema(cinema);
        Room savedRoom = roomRepository.save(room);
        return convertToDTO(savedRoom);
    }

    @Override
    @Transactional
    public RoomDTO updateRoom(Integer roomId, RoomDTO roomDTO) {
        Room room = findRoomById(roomId);
        Cinema cinema = cinemaRepository.findById(roomDTO.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", roomDTO.getCinemaId()));
        
        checkCinemaAccess(cinema.getId());

        room.setName(roomDTO.getName());
        room.setCinema(cinema);
        return convertToDTO(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void deleteRoom(Integer roomId) {
        Room room = findRoomById(roomId);
        checkCinemaAccess(room.getCinema().getId());

        // Kiểm tra xem có lịch chiếu nào đang sử dụng phòng này không
        List<Showtime> showtimes = showtimeRepository.findByRoomIdIn(List.of(roomId));
        if (!showtimes.isEmpty()) {
            throw new IllegalStateException("Cannot delete room with active showtimes.");
        }

        roomRepository.delete(room);
    }

    private Room findRoomById(Integer id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    private RoomDTO convertToDTO(Room room) {
        return new RoomDTO(room.getId(), room.getName(), room.getCinema().getId());
    }
}
