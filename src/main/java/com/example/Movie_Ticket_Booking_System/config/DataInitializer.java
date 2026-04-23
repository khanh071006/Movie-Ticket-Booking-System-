package com.example.Movie_Ticket_Booking_System.config;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountRepository;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRoleRepository;
import com.example.Movie_Ticket_Booking_System.features.role.Role;
import com.example.Movie_Ticket_Booking_System.features.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(AccountRepository accountRepository, 
                                   RoleRepository roleRepository, 
                                   AccountRoleRepository accountRoleRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Khởi tạo các Role nếu chưa có
            if (roleRepository.count() == 0) {
                Role adminRole = new Role();
                adminRole.setName("ADMIN");
                Role userRole = new Role();
                userRole.setName("USER");
                roleRepository.saveAll(List.of(adminRole, userRole));
                System.out.println(">> Đã khởi tạo Roles: ADMIN, USER");
            }

            // 2. Khởi tạo tài khoản mẫu nếu chưa có tài khoản nào
            if (accountRepository.count() == 0) {
                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy role ADMIN"));
                Role userRole = roleRepository.findByName("USER")
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy role USER"));

                // Tạo tài khoản Admin
                Account admin = new Account();
                admin.setEmail("admin@gmail.com");
                admin.setFullName("Quản Trị Viên");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setPhone("0988888888");
                admin.setActive(true);
                accountRepository.save(admin);

                AccountRole adminLink = new AccountRole();
                adminLink.setAccount(admin);
                adminLink.setRole(adminRole);
                accountRoleRepository.save(adminLink);

                // Tạo tài khoản User mẫu
                Account user = new Account();
                user.setEmail("user@gmail.com");
                user.setFullName("Người Dùng Mẫu");
                user.setPasswordHash(passwordEncoder.encode("user123"));
                user.setPhone("0977777777");
                user.setActive(true);
                accountRepository.save(user);

                AccountRole userLink = new AccountRole();
                userLink.setAccount(user);
                userLink.setRole(userRole);
                accountRoleRepository.save(userLink);
                
                System.out.println(">> Đã khởi tạo tài khoản mẫu: admin@gmail.com / user@gmail.com");
            }
        };
    }
}
