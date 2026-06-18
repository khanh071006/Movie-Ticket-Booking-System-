package com.example.Movie_Ticket_Booking_System.features.report;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/revenue-by-date")
    public ResponseEntity<ApiResponse<List<RevenueByDateProjection>>> getRevenueByDate(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        Long cinemaId = jwt.hasClaim("cinemaId") ? jwt.getClaim("cinemaId") : null;
        return ResponseEntity.ok(ApiResponse.success("Success", reportService.getRevenueByDate(cinemaId)));
    }

    @GetMapping("/revenue-by-movie")
    public ResponseEntity<ApiResponse<List<RevenueByMovieProjection>>> getRevenueByMovie(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        Long cinemaId = jwt.hasClaim("cinemaId") ? jwt.getClaim("cinemaId") : null;
        return ResponseEntity.ok(ApiResponse.success("Success", reportService.getRevenueByMovie(cinemaId)));
    }

    @GetMapping("/revenue/cinemas")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<RevenueByCinemaProjection>>> getRevenueByCinema() {
        return ResponseEntity.ok(ApiResponse.success("Success", reportService.getRevenueByCinema()));
    }
}
