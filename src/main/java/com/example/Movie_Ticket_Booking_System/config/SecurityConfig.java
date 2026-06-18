package com.example.Movie_Ticket_Booking_System.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/payments/vnpay/**").permitAll()

                        // Phân quyền cho Feature Account
                        .requestMatchers(HttpMethod.GET, "/api/v1/accounts/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/accounts", "/api/v1/accounts/**").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/accounts").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/accounts/**").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/accounts/**").hasAnyRole("SUPERADMIN", "MANAGER")

                        // Phân quyền cho Feature Movie
                        .requestMatchers(HttpMethod.GET, "/api/v1/movies/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/movies").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/movies/**").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/movies/**").hasRole("SUPERADMIN")

                        // Phân quyền cho Feature Category
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/categories").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/categories/**").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/**").hasRole("SUPERADMIN")

                        // Phân quyền cho Feature Room
                        .requestMatchers(HttpMethod.GET, "/api/v1/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/rooms").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/rooms/**").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/rooms/**").hasAnyRole("SUPERADMIN", "MANAGER")

                        // Phân quyền cho Feature Showtime
                        .requestMatchers(HttpMethod.GET, "/api/v1/showtimes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/showtimes").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/showtimes/**").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/showtimes/**").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/api/v1/bookings/showtime/*/booked-seats").permitAll()

                        // Danh mục (cũ)
                        .requestMatchers(HttpMethod.GET, "/api/v1/directors/**", "/api/v1/genres/**", "/api/v1/movie-statuses/**", "/api/v1/cast-members/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/directors", "/api/v1/genres", "/api/v1/movie-statuses", "/api/v1/cast-members").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/directors/**", "/api/v1/genres/**", "/api/v1/movie-statuses/**", "/api/v1/cast-members/**").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/directors/**", "/api/v1/genres/**", "/api/v1/movie-statuses/**", "/api/v1/cast-members/**").hasRole("SUPERADMIN")

                        // Role
                        .requestMatchers("/api/v1/roles/**").hasRole("SUPERADMIN")

                        // Cinema
                        .requestMatchers(HttpMethod.GET, "/api/v1/cinemas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/cinemas").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/cinemas/**").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/cinemas/**").hasRole("SUPERADMIN")

                        // SeatType, TicketType, State, SnackType, Snack
                        .requestMatchers(HttpMethod.GET, "/api/v1/seat-types/**", "/api/v1/ticket-types/**", "/api/v1/states/**", "/api/v1/snack-types/**", "/api/v1/snacks/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/seat-types", "/api/v1/ticket-types", "/api/v1/states", "/api/v1/snack-types").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/seat-types/**", "/api/v1/ticket-types/**", "/api/v1/states/**", "/api/v1/snack-types/**").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/seat-types/**", "/api/v1/ticket-types/**", "/api/v1/states/**", "/api/v1/snack-types/**").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/snacks").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/snacks/**").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/snacks/**").hasAnyRole("SUPERADMIN", "MANAGER")

                        // Promotions
                        .requestMatchers(HttpMethod.GET, "/api/v1/promotions/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/promotions").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/promotions/**").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/promotions/**").hasRole("SUPERADMIN")

                        // Booking checkin
                        .requestMatchers(HttpMethod.PUT, "/api/v1/bookings/*/checkin").hasAnyRole("SUPERADMIN", "MANAGER", "STAFF")
                        .requestMatchers("/api/v1/bookings/**").authenticated()

                        // Stats and Reports
                        .requestMatchers(HttpMethod.GET, "/api/v1/stats/**").hasAnyRole("SUPERADMIN", "MANAGER")
                        .requestMatchers("/api/v1/reports/**").hasAnyRole("SUPERADMIN", "MANAGER", "STAFF")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.vercel.app",
                "https://movie-ticket-booking-system-p6z3.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecretKey secretKey() {
        return new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256");
    }

    @Bean
    public JwtEncoder jwtEncoder(SecretKey secretKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
    }

    @Bean
    public JwtDecoder jwtDecoder(SecretKey secretKey) {
        return NimbusJwtDecoder.withSecretKey(secretKey).build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("scope");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
