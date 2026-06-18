package com.example.Movie_Ticket_Booking_System.features.snack;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.snack.dto.ReqSnackDTO;
import com.example.Movie_Ticket_Booking_System.features.snack_type.SnackType;
import com.example.Movie_Ticket_Booking_System.features.snack_type.SnackTypeRepository;
import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountRepository;
import com.example.Movie_Ticket_Booking_System.security.SecurityUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SnackServiceImpl implements SnackService {

    private final SnackRepository snackRepository;
    private final SnackTypeRepository snackTypeRepository;
    private final AccountRepository accountRepository;

    public SnackServiceImpl(SnackRepository snackRepository, SnackTypeRepository snackTypeRepository, AccountRepository accountRepository) {
        this.snackRepository = snackRepository;
        this.snackTypeRepository = snackTypeRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Snack> getAllSnacks(int page, int size) {
        org.springframework.data.domain.Page<Snack> snackPage = snackRepository.findAll(org.springframework.data.domain.PageRequest.of(page, size));
        return new com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<>(
            snackPage.getContent(),
            snackPage.getNumber(),
            snackPage.getSize(),
            snackPage.getTotalElements(),
            snackPage.getTotalPages(),
            snackPage.isLast()
        );
    }

    @Override
    public Snack getSnackById(Integer id) {
        return snackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snack", "id", id.toString()));
    }

    @Override
    public Snack createSnack(ReqSnackDTO dto) {
        Snack snack = new Snack();
        mapDtoToEntity(dto, snack);
        
        String currentUserEmail = SecurityUtil.getCurrentUserLogin().orElse(null);
        if (currentUserEmail != null) {
            Account account = accountRepository.findByEmail(currentUserEmail).orElse(null);
            if (account != null && account.getCinema() != null) {
                snack.setCinema(account.getCinema());
            }
        }
        
        return snackRepository.save(snack);
    }

    @Override
    public Snack updateSnack(Integer id, ReqSnackDTO dto) {
        Snack snack = getSnackById(id);
        mapDtoToEntity(dto, snack);
        return snackRepository.save(snack);
    }

    @Override
    public void deleteSnack(Integer id) {
        Snack snack = getSnackById(id);
        snackRepository.delete(snack);
    }

    private void mapDtoToEntity(ReqSnackDTO dto, Snack snack) {
        SnackType snackType = snackTypeRepository.findById(dto.getSnackTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("SnackType", "id", dto.getSnackTypeId().toString()));
        snack.setSnackType(snackType);
        snack.setName(dto.getName());
        snack.setBasePrice(dto.getBasePrice());
        snack.setImageUrl(dto.getImageUrl());
    }
}
