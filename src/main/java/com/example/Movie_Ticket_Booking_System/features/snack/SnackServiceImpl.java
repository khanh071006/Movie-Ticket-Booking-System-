package com.example.Movie_Ticket_Booking_System.features.snack;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.snack.dto.ReqSnackDTO;
import com.example.Movie_Ticket_Booking_System.features.snack_type.SnackType;
import com.example.Movie_Ticket_Booking_System.features.snack_type.SnackTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SnackServiceImpl implements SnackService {

    private final SnackRepository snackRepository;
    private final SnackTypeRepository snackTypeRepository;

    public SnackServiceImpl(SnackRepository snackRepository, SnackTypeRepository snackTypeRepository) {
        this.snackRepository = snackRepository;
        this.snackTypeRepository = snackTypeRepository;
    }

    @Override
    public List<Snack> getAllSnacks() {
        return snackRepository.findAll();
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
