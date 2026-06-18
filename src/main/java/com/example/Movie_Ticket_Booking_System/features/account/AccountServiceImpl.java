package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqCreateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqUpdateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRoleRepository;
import com.example.Movie_Ticket_Booking_System.features.role.Role;
import com.example.Movie_Ticket_Booking_System.features.role.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.example.Movie_Ticket_Booking_System.features.email.EmailService emailService;
    private final com.example.Movie_Ticket_Booking_System.features.cinema.CinemaRepository cinemaRepository;

    public AccountServiceImpl(AccountRepository accountRepository, RoleRepository roleRepository, AccountRoleRepository accountRoleRepository, PasswordEncoder passwordEncoder, com.example.Movie_Ticket_Booking_System.features.email.EmailService emailService, com.example.Movie_Ticket_Booking_System.features.cinema.CinemaRepository cinemaRepository) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.accountRoleRepository = accountRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.cinemaRepository = cinemaRepository;
    }

    @Override
    @Transactional
    public Account handleRegister(ReqRegisterDTO dto) {
        if (this.accountRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Account", "email", dto.getEmail());
        }

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());
        account.setPasswordHash(this.passwordEncoder.encode(dto.getPassword()));
        account.setActive(false);
        account.setOtpCode(otp);
        account.setOtpExpiryTime(java.time.LocalDateTime.now().plusMinutes(5));

        Account newAccount = this.accountRepository.save(account);

        Role userRole = this.roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "USER"));

        AccountRole newAccountRole = new AccountRole();
        newAccountRole.setAccount(newAccount);
        newAccountRole.setRole(userRole);
        this.accountRoleRepository.save(newAccountRole);

        emailService.sendOtpVerificationEmail(newAccount.getEmail(), otp);

        return newAccount;
    }

    @Override
    public Account handleGetAccountByEmail(String email) {
        return this.accountRepository.findByEmail(email).orElse(null);
    }

    @Override
    @Transactional
    public List<Account> handleGetAccounts() {
        List<Account> accounts = this.accountRepository.findAll();
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERADMIN"));
        
        if (!isSuperAdmin) {
            return accounts.stream().filter(acc -> 
                acc.getAccountRoles() == null || acc.getAccountRoles().stream().noneMatch(ar -> ar.getRole().getName().equals("SUPERADMIN"))
            ).collect(java.util.stream.Collectors.toList());
        }
        return accounts;
    }

    @Override
    @Transactional
    public Account handleCreateAccount(ReqCreateAccountDTO dto) {
        if (accountRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Account", "email", dto.getEmail());
        }

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERADMIN"));

        if (dto.getRoles() != null && dto.getRoles().contains("SUPERADMIN") && !isSuperAdmin) {
            throw new com.example.Movie_Ticket_Booking_System.exception.BadRequestException("Bạn không có quyền tạo tài khoản SUPERADMIN.");
        }

        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());
        account.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        account.setActive(true);

        Account newAccount = accountRepository.save(account);

        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : dto.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
                roles.add(role);
            }

            if (dto.getRoles().contains("STAFF") || dto.getRoles().contains("MANAGER")) {
                if (dto.getCinemaId() == null) {
                    throw new com.example.Movie_Ticket_Booking_System.exception.BadRequestException("Nhân viên/Quản lý phải được gán vào một rạp chiếu phim (cinemaId không được trống)");
                }
                com.example.Movie_Ticket_Booking_System.features.cinema.Cinema cinema = cinemaRepository.findById(dto.getCinemaId())
                        .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", dto.getCinemaId().toString()));
                newAccount.setCinema(cinema);
                accountRepository.save(newAccount);
            }

            for (Role role : roles) {
                AccountRole newAccountRole = new AccountRole();
                newAccountRole.setAccount(newAccount);
                newAccountRole.setRole(role);
                accountRoleRepository.save(newAccountRole);
            }
        }

        return newAccount;
    }

    @Override
    public Account handleGetAccountById(UUID id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id.toString()));
    }

    @Override
    @Transactional
    public Account handleUpdateAccount(UUID id, ReqUpdateAccountDTO dto) {
        Account account = handleGetAccountById(id);
        
        boolean targetIsSuperAdmin = account.getAccountRoles() != null && account.getAccountRoles().stream().anyMatch(ar -> ar.getRole().getName().equals("SUPERADMIN"));
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERADMIN"));
        
        if (targetIsSuperAdmin && !isSuperAdmin) {
            throw new com.example.Movie_Ticket_Booking_System.exception.BadRequestException("Bạn không có quyền chỉnh sửa tài khoản SUPERADMIN.");
        }
        
        if (dto.getRoles() != null && dto.getRoles().contains("SUPERADMIN") && !isSuperAdmin) {
            throw new com.example.Movie_Ticket_Booking_System.exception.BadRequestException("Bạn không có quyền cấp vai trò SUPERADMIN.");
        }

        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());

        // Update roles
        if (dto.getRoles() != null) {
            // Clear existing roles
            accountRoleRepository.deleteByAccount(account);

            // Add new roles
            Set<Role> newRoles = new HashSet<>();
            for (String roleName : dto.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
                newRoles.add(role);
            }

            for (Role role : newRoles) {
                AccountRole newAccountRole = new AccountRole();
                newAccountRole.setAccount(account);
                newAccountRole.setRole(role);
                accountRoleRepository.save(newAccountRole);
            }

            if (dto.getRoles().contains("STAFF") || dto.getRoles().contains("MANAGER")) {
                if (dto.getCinemaId() == null) {
                    throw new com.example.Movie_Ticket_Booking_System.exception.BadRequestException("Nhân viên/Quản lý phải được gán vào một rạp chiếu phim (cinemaId không được trống)");
                }
                com.example.Movie_Ticket_Booking_System.features.cinema.Cinema cinema = cinemaRepository.findById(dto.getCinemaId())
                        .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", dto.getCinemaId().toString()));
                account.setCinema(cinema);
            } else {
                account.setCinema(null);
            }
        }

        return accountRepository.save(account);
    }

    @Override
    @Transactional
    public void handleDeleteAccount(UUID id) {
        Account account = handleGetAccountById(id);
        
        boolean targetIsSuperAdmin = account.getAccountRoles() != null && account.getAccountRoles().stream().anyMatch(ar -> ar.getRole().getName().equals("SUPERADMIN"));
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERADMIN"));
        
        if (targetIsSuperAdmin && !isSuperAdmin) {
            throw new com.example.Movie_Ticket_Booking_System.exception.BadRequestException("Bạn không có quyền xóa tài khoản SUPERADMIN.");
        }

        accountRoleRepository.deleteByAccount(account);
        accountRepository.delete(account);
    }

    @Override
    @Transactional
    public void handleVerifyOtp(String email, String otpCode) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "email", email));

        if (account.isActive()) {
            throw new IllegalArgumentException("Tài khoản đã được kích hoạt.");
        }

        if (!otpCode.equals(account.getOtpCode())) {
            throw new IllegalArgumentException("Mã OTP không hợp lệ.");
        }

        if (account.getOtpExpiryTime() != null && account.getOtpExpiryTime().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("Mã OTP đã hết hạn.");
        }

        account.setActive(true);
        account.setOtpCode(null);
        account.setOtpExpiryTime(null);
        accountRepository.save(account);
    }
}
