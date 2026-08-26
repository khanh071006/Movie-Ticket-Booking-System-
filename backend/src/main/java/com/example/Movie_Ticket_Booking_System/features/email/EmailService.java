package com.example.Movie_Ticket_Booking_System.features.email;

import com.example.Movie_Ticket_Booking_System.features.booking.Booking;
import com.example.Movie_Ticket_Booking_System.features.booking.BookingSeat;
import com.example.Movie_Ticket_Booking_System.features.booking.BookingTicket;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final QRCodeGenerator qrCodeGenerator;
    private final com.example.Movie_Ticket_Booking_System.features.booking.BookingRepository bookingRepository;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    public EmailService(JavaMailSender javaMailSender, QRCodeGenerator qrCodeGenerator, com.example.Movie_Ticket_Booking_System.features.booking.BookingRepository bookingRepository) {
        this.javaMailSender = javaMailSender;
        this.qrCodeGenerator = qrCodeGenerator;
        this.bookingRepository = bookingRepository;
    }

    @Async
    @org.springframework.transaction.annotation.Transactional
    public void sendBookingConfirmation(java.util.UUID bookingId) {
        if (senderEmail == null || senderEmail.isEmpty()) {
            System.out.println("Email configuration not found. Skipping email sending. Booking ID: " + bookingId);
            return;
        }

        try {
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) {
                System.out.println("Booking not found. Cannot send confirmation.");
                return;
            }

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            String toEmail = booking.getAccount() != null ? booking.getAccount().getEmail() : null;
            if (toEmail == null) {
                System.out.println("Account email is null. Cannot send confirmation.");
                return;
            }
            helper.setTo(toEmail);
            helper.setSubject("Xác nhận đặt vé thành công - " + booking.getShowtime().getMovie().getTitle());

            // Generate QR Code
            byte[] qrCodeImage = qrCodeGenerator.generateQRCodeImage(booking.getId().toString(), 250, 250);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            String seats = booking.getBookingSeats().stream()
                    .map(BookingSeat::getSeat)
                    .map(s -> s.getSeatLocation())
                    .collect(Collectors.joining(", "));
            String tickets = booking.getBookingTickets().stream()
                    .map(bt -> bt.getTicketQty() + "x " + bt.getTicketType().getName())
                    .collect(Collectors.joining(", "));

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;'>" +
                    "<div style='background-color: #1a1a1a; color: #fff; padding: 20px; text-align: center;'>" +
                    "<h2>CINESTAR - VÉ ĐIỆN TỬ</h2>" +
                    "</div>" +
                    "<div style='padding: 20px;'>" +
                    "<h3 style='color: #e50914;'>" + booking.getShowtime().getMovie().getTitle() + "</h3>" +
                    "<p><strong>Rạp:</strong> " + booking.getShowtime().getRoom().getCinema().getName() + "</p>" +
                    "<p><strong>Phòng chiếu:</strong> " + booking.getShowtime().getRoom().getName() + "</p>" +
                    "<p><strong>Thời gian:</strong> " + booking.getShowtime().getStartTime().format(formatter) + "</p>" +
                    "<p><strong>Loại vé:</strong> " + tickets + "</p>" +
                    "<p><strong>Ghế:</strong> " + seats + "</p>" +
                    "<p><strong>Tổng tiền:</strong> " + booking.getTotalAmount() + " VNĐ</p>" +
                    "<hr style='border: none; border-top: 1px dashed #ccc;'/>" +
                    "<div style='text-align: center; margin-top: 20px;'>" +
                    "<p>Vui lòng xuất trình mã QR này cho nhân viên khi tới rạp:</p>" +
                    "<img src='cid:qrcode' alt='QR Code' style='border: 1px solid #ccc; padding: 10px; border-radius: 10px;'/>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);

            // Add Inline Image with filename so Gmail accepts it
            helper.addInline("qrcode", new ByteArrayResource(qrCodeImage) {
                @Override
                public String getFilename() {
                    return "qrcode.png";
                }
            }, "image/png");

            javaMailSender.send(message);
            System.out.println("Booking confirmation email sent to " + toEmail);

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendOtpVerificationEmail(String toEmail, String otpCode) {
        if (senderEmail == null || senderEmail.isEmpty()) {
            System.out.println("Email configuration not found. Skipping OTP email sending.");
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject("Mã xác nhận đăng ký tài khoản CINESTAR");

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;'>" +
                    "<div style='background-color: #1a1a1a; color: #fff; padding: 20px; text-align: center;'>" +
                    "<h2>CINESTAR - XÁC NHẬN TÀI KHOẢN</h2>" +
                    "</div>" +
                    "<div style='padding: 20px;'>" +
                    "<p>Chào bạn,</p>" +
                    "<p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống đặt vé CINESTAR.</p>" +
                    "<p>Mã OTP xác nhận tài khoản của bạn là:</p>" +
                    "<div style='text-align: center; margin: 20px 0;'>" +
                    "<span style='display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #e50914; background-color: #f5f5f5; border-radius: 8px; letter-spacing: 5px;'>" +
                    otpCode + "</span>" +
                    "</div>" +
                    "<p style='color: #666; font-size: 14px;'>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            System.out.println("OTP verification email sent to " + toEmail);

        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
