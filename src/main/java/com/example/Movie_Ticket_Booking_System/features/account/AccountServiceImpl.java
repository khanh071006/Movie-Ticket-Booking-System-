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
import java.util.stream.Collectors;

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

    @Override
    @Transactional
    public Account handleCreateAccount(ReqCreateAccountDTO dto) {
        if (accountRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Account", "email", dto.getEmail());
        }

        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());
        account.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        Account newAccount = accountRepository.save(account);

        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName)))
                    .collect(Collectors.toSet());

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
        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());

        // Update roles
        if (dto.getRoles() != null) {
            // Clear existing roles
            accountRoleRepository.deleteByAccount(account);

            // Add new roles
            Set<Role> newRoles = dto.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName)))
                    .collect(Collectors.toSet());

            for (Role role : newRoles) {
                AccountRole newAccountRole = new AccountRole();
                newAccountRole.setAccount(account);
                newAccountRole.setRole(role);
                accountRoleRepository.save(newAccountRole);
            }
        }

        return accountRepository.save(account);
    }

    @Override
    @Transactional
    public void handleDeleteAccount(UUID id) {
        Account account = handleGetAccountById(id);
        accountRoleRepository.deleteByAccount(account);
        accountRepository.delete(account);
    }
}
