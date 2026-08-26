package com.example.Movie_Ticket_Booking_System.features.snack_type;

import java.util.List;

public interface SnackTypeService {
    List<SnackType> getAllSnackTypes();
    SnackType getSnackTypeById(Integer id);
    SnackType createSnackType(String name);
    SnackType updateSnackType(Integer id, String name);
    void deleteSnackType(Integer id);
}
