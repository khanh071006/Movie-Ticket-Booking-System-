package com.example.Movie_Ticket_Booking_System.features.report;

import java.time.LocalDate;

public interface RevenueByDateProjection {
    LocalDate getDate();
    Long getTotal();
}
