package com.example.Movie_Ticket_Booking_System.features.snack_type;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SnackTypeServiceImpl implements SnackTypeService {

    private final SnackTypeRepository snackTypeRepository;

    public SnackTypeServiceImpl(SnackTypeRepository snackTypeRepository) {
        this.snackTypeRepository = snackTypeRepository;
    }

    @Override
    public List<SnackType> getAllSnackTypes() {
        return snackTypeRepository.findAll();
    }

    @Override
    public SnackType getSnackTypeById(Integer id) {
        return snackTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SnackType", "id", id.toString()));
    }

    @Override
    public SnackType createSnackType(String name) {
        SnackType snackType = new SnackType();
        snackType.setName(name);
        return snackTypeRepository.save(snackType);
    }

    @Override
    public SnackType updateSnackType(Integer id, String name) {
        SnackType snackType = getSnackTypeById(id);
        snackType.setName(name);
        return snackTypeRepository.save(snackType);
    }

    @Override
    public void deleteSnackType(Integer id) {
        SnackType snackType = getSnackTypeById(id);
        snackTypeRepository.delete(snackType);
    }
}
