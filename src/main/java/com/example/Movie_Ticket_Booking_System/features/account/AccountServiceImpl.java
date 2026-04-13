package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRoleRepository;
import com.example.Movie_Ticket_Booking_System.features.role.Role;
import com.example.Movie_Ticket_Booking_System.features.role.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountServiceImpl(AccountRepository accountRepository, RoleRepository roleRepository, AccountRoleRepository accountRoleRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.accountRoleRepository = accountRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public Account handleRegister(ReqRegisterDTO dto) {
        if (this.accountRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Account", "email", dto.getEmail());
        }

        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());
        account.setPasswordHash(this.passwordEncoder.encode(dto.getPassword()));

        Account newAccount = this.accountRepository.save(account);

        Role userRole = this.roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "USER"));

        AccountRole newAccountRole = new AccountRole();
        newAccountRole.setAccount(newAccount);
        newAccountRole.setRole(userRole);
        this.accountRoleRepository.save(newAccountRole);

        return newAccount;
    }

    @Override
    public Account handleGetAccountByEmail(String email) {
        return this.accountRepository.findByEmail(email).orElse(null);
    }

    @Override
    public List<Account> handleGetAccounts() {
        return this.accountRepository.findAll();
    }
}
