package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqUpdateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ResAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRoleRepository;
import com.example.Movie_Ticket_Booking_System.features.role.Role;
import com.example.Movie_Ticket_Booking_System.features.role.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

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
    public Page<ResAccountDTO> getAllAccounts(Pageable pageable) {
        Page<Account> accounts = accountRepository.findAll(pageable);
        return accounts.map(this::mapToResponseDTO);
    }

    @Override
    public ResAccountDTO getAccountById(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));
        return mapToResponseDTO(account);
    }

    @Override
    @Transactional
    public ResAccountDTO updateAccount(UUID id, ReqUpdateAccountDTO dto) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));

        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());

        Account updatedAccount = accountRepository.save(account);
        return mapToResponseDTO(updatedAccount);
    }

    @Override
    @Transactional
    public void deleteAccount(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));
        account.setActive(false);
        accountRepository.save(account);
    }

    private ResAccountDTO mapToResponseDTO(Account account) {
        return new ResAccountDTO(
                account.getId(),
                account.getEmail(),
                account.getFullName(),
                account.getPhone(),
                account.isActive()
        );
    }
}
