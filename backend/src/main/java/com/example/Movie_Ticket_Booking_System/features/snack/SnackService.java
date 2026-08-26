package com.example.Movie_Ticket_Booking_System.features.snack;

import com.example.Movie_Ticket_Booking_System.features.snack.dto.ReqSnackDTO;
import java.util.List;

public interface SnackService {
    com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Snack> getAllSnacks(int page, int size);
    Snack getSnackById(Integer id);
    Snack createSnack(ReqSnackDTO reqSnackDTO);
    Snack updateSnack(Integer id, ReqSnackDTO reqSnackDTO);
    void deleteSnack(Integer id);
}
