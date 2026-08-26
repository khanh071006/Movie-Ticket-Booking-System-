package com.example.Movie_Ticket_Booking_System.features.cinema_pricing;

import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto.ReqCinemaPricingDTO;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto.ResCinemaPricingDTO;

public interface CinemaPricingService {
    ResCinemaPricingDTO getPricingByCinemaId(Integer cinemaId);
    ResCinemaPricingDTO updatePricing(Integer cinemaId, ReqCinemaPricingDTO dto);
}
