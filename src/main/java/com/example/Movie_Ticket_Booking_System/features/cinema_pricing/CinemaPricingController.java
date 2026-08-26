package com.example.Movie_Ticket_Booking_System.features.cinema_pricing;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto.ReqCinemaPricingDTO;
import com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto.ResCinemaPricingDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cinemas/{cinemaId}/pricing")
public class CinemaPricingController {

    private final CinemaPricingService cinemaPricingService;

    public CinemaPricingController(CinemaPricingService cinemaPricingService) {
        this.cinemaPricingService = cinemaPricingService;
    }

@PreAuthorize("hasAuthority('PRICING_MANAGE')")
    @GetMapping
    public ResponseEntity<ApiResponse<ResCinemaPricingDTO>> getPricing(@PathVariable Integer cinemaId) {
        ResCinemaPricingDTO res = cinemaPricingService.getPricingByCinemaId(cinemaId);
        return ResponseEntity.ok(ApiResponse.success("Cinema pricing retrieved successfully", res));
    }

@PreAuthorize("hasAuthority('PRICING_MANAGE')")
    @PutMapping
    public ResponseEntity<ApiResponse<ResCinemaPricingDTO>> updatePricing(@PathVariable Integer cinemaId, @RequestBody ReqCinemaPricingDTO dto) {
        ResCinemaPricingDTO res = cinemaPricingService.updatePricing(cinemaId, dto);
        return ResponseEntity.ok(ApiResponse.success("Cinema pricing updated successfully", res));
    }
}
