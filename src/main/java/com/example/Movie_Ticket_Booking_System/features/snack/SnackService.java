package com.example.Movie_Ticket_Booking_System.features.snack;

import com.example.Movie_Ticket_Booking_System.features.snack.dto.ReqSnackDTO;
import java.util.List;

public interface SnackService {
    List<Snack> getAllSnacks();
    Snack getSnackById(Integer id);
    Snack createSnack(ReqSnackDTO reqSnackDTO);
    Snack updateSnack(Integer id, ReqSnackDTO reqSnackDTO);
    void deleteSnack(Integer id);
}
