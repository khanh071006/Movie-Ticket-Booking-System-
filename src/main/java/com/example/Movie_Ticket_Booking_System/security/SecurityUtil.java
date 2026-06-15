package com.example.Movie_Ticket_Booking_System.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Utility class để xử lý các tác vụ liên quan đến security, đặc biệt là JWT.
 */
@Component
public class SecurityUtil {

    private final JwtEncoder jwtEncoder;

    @Value("${jwt.expires-in}")
    private long expiresIn;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    /**
     * Tạo một chuỗi JWT từ thông tin xác thực của người dùng.
     *
     * @param authentication Đối tượng Authentication chứa thông tin người dùng đã được xác thực.
     * @return Chuỗi JWT.
     */
    public String createToken(Authentication authentication) {
        Instant now = Instant.now();
        
        StringBuilder scopeBuilder = new StringBuilder();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (scopeBuilder.length() > 0) {
                scopeBuilder.append(" ");
            }
            scopeBuilder.append(authority.getAuthority());
        }
        String scope = scopeBuilder.toString();

        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(expiresIn, ChronoUnit.SECONDS)) // Sử dụng giá trị từ properties
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}
