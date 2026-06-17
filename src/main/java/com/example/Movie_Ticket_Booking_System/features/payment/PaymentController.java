package com.example.Movie_Ticket_Booking_System.features.payment;

import com.example.Movie_Ticket_Booking_System.features.booking.Booking;
import com.example.Movie_Ticket_Booking_System.features.booking.BookingRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingRepository bookingRepository;

    public PaymentController(PaymentService paymentService, BookingRepository bookingRepository) {
        this.paymentService = paymentService;
        this.bookingRepository = bookingRepository;
    }

    @PostMapping("/vnpay/create-url")
    public ResponseEntity<?> createPaymentUrl(@RequestParam UUID bookingId, HttpServletRequest request) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking not found");
        }
        Booking booking = bookingOpt.get();
        if ("PAID".equals(booking.getPaymentStatus())) {
            return ResponseEntity.badRequest().body("Booking is already paid");
        }
        
        String ipAddress = request.getRemoteAddr();
        String url = paymentService.createPaymentUrl(booking.getId().toString(), booking.getTotalAmount().longValue(), ipAddress);
        return ResponseEntity.ok(Map.of("paymentUrl", url));
    }

    @GetMapping("/vnpay/verify")
    public ResponseEntity<?> verifyPayment(@RequestParam Map<String, String> params) {
        boolean isValid = paymentService.verifyPayment(params);
        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef"); // bookingId_timestamp
        if (txnRef == null || !txnRef.contains("_")) {
            return ResponseEntity.badRequest().body("Invalid TxnRef");
        }
        String bookingIdStr = txnRef.split("_")[0];

        Optional<Booking> bookingOpt = bookingRepository.findById(UUID.fromString(bookingIdStr));
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking not found");
        }

        Booking booking = bookingOpt.get();

        if ("00".equals(responseCode)) {
            booking.setPaymentStatus("PAID");
            bookingRepository.save(booking);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified and updated"));
        } else {
            booking.setPaymentStatus("FAILED");
            bookingRepository.save(booking);
            return ResponseEntity.ok(Map.of("status", "failed", "message", "Payment failed"));
        }
    }
}
