package com.example.Movie_Ticket_Booking_System.features.castmember;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ReqCastMemberDTO;
import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ResCastMemberDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CastMemberServiceImpl implements CastMemberService {

    private final CastMemberRepository castMemberRepository;

    public CastMemberServiceImpl(CastMemberRepository castMemberRepository) {
        this.castMemberRepository = castMemberRepository;
    }

    @Override
    @Transactional
    public ResCastMemberDTO handleCreateCastMember(ReqCastMemberDTO reqCastMemberDTO) {
        if (castMemberRepository.findByName(reqCastMemberDTO.getName()).isPresent()) {
            throw new DuplicateResourceException("CastMember", "name", reqCastMemberDTO.getName());
        }
        CastMember castMember = new CastMember();
        castMember.setName(reqCastMemberDTO.getName());
        castMember = castMemberRepository.save(castMember);
        return ResCastMemberDTO.fromCastMember(castMember);
    }

    @Override
    public List<ResCastMemberDTO> handleGetAllCastMembers() {
        List<CastMember> castMembers = castMemberRepository.findAll();
        List<ResCastMemberDTO> res = new ArrayList<>();
        for (CastMember c : castMembers) {
            res.add(ResCastMemberDTO.fromCastMember(c));
        }
        return res;
    }

    @Override
    public ResCastMemberDTO handleGetCastMemberById(Integer id) {
        CastMember castMember = castMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CastMember", "id", id));
        return ResCastMemberDTO.fromCastMember(castMember);
    }

    @Override
    @Transactional
    public ResCastMemberDTO handleUpdateCastMember(Integer id, ReqCastMemberDTO reqCastMemberDTO) {
        CastMember existingCastMember = castMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CastMember", "id", id));

        String newName = reqCastMemberDTO.getName();

        if (!existingCastMember.getName().equals(newName)) {
            Optional<CastMember> castMemberWithNewName = castMemberRepository.findByName(newName);
            if (castMemberWithNewName.isPresent()) {
                throw new DuplicateResourceException("CastMember", "name", newName);
            }
            existingCastMember.setName(newName);
        }

        CastMember updatedCastMember = castMemberRepository.save(existingCastMember);
        return ResCastMemberDTO.fromCastMember(updatedCastMember);
    }

    @Override
    @Transactional
    public void handleDeleteCastMember(Integer id) {
        if (!castMemberRepository.existsById(id)) {
            throw new ResourceNotFoundException("CastMember", "id", id);
        }
        castMemberRepository.deleteById(id);
    }
}
