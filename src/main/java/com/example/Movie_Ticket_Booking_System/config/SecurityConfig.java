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

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

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
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // Phân quyền cho Feature Account
                        .requestMatchers(HttpMethod.GET, "/api/v1/accounts").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/accounts").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/accounts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/accounts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/accounts/**").hasRole("ADMIN")

                        // Phân quyền cho Feature Movie
                        .requestMatchers(HttpMethod.GET, "/api/v1/movies/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/movies/**").hasRole("ADMIN")

                        // Phân quyền cho Feature Role
                        .requestMatchers("/api/v1/roles/**").hasRole("ADMIN")

                        // Phân quyền cho Feature Cinema
                        .requestMatchers(HttpMethod.GET, "/api/v1/cinemas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/cinemas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/cinemas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/cinemas/**").hasRole("ADMIN")

                        // Phân quyền cho Feature Room
                        .requestMatchers(HttpMethod.GET, "/api/v1/rooms/cinema/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/rooms").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/rooms/**").hasRole("ADMIN")

                        // Phân quyền cho Feature Showtime
                        .requestMatchers(HttpMethod.GET, "/api/v1/showtimes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/showtimes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/showtimes/**").hasRole("ADMIN")

                        // Phân quyền cho các Feature Danh mục
                        .requestMatchers(HttpMethod.GET, "/api/v1/directors/**", "/api/v1/genres/**", "/api/v1/movie-statuses/**", "/api/v1/cast-members/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/directors", "/api/v1/genres", "/api/v1/movie-statuses", "/api/v1/cast-members").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/directors/**", "/api/v1/genres/**", "/api/v1/movie-statuses/**", "/api/v1/cast-members/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/directors/**", "/api/v1/genres/**", "/api/v1/movie-statuses/**", "/api/v1/cast-members/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
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

    // --- THÊM BEAN NÀY ĐỂ "DỌN DẸP" TIỀN TỐ SCOPE_ ---
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
