package com.example.Movie_Ticket_Booking_System.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // 1. Khởi tạo Bean băm mật khẩu
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Khởi tạo Bean cấu hình phân quyền đường dẫn
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF vì mình dùng API stateless
                .authorizeHttpRequests(auth -> auth
                        // Cấp phép cho mọi người đều được truy cập API đăng ký và đăng nhập
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login").permitAll()
                        // Cấp phép cho mọi người dùng đã xác thực lấy danh sách người dùng
                        .requestMatchers(HttpMethod.GET, "/api/v1/users").authenticated()
                        // Mọi API khác phải yêu cầu xác thực
                        .anyRequest().authenticated());
        http
                        .formLogin(Customizer.withDefaults())
                        .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
