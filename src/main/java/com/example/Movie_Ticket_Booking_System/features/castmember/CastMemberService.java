package com.example.Movie_Ticket_Booking_System.features.castmember;

import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ReqCastMemberDTO;
import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ResCastMemberDTO;

import java.util.List;
import java.util.UUID;

public interface CastMemberService {
    ResCastMemberDTO handleCreateCastMember(ReqCastMemberDTO reqCastMemberDTO);
    List<ResCastMemberDTO> handleGetAllCastMembers();
    ResCastMemberDTO handleGetCastMemberById(UUID id);
    ResCastMemberDTO handleUpdateCastMember(UUID id, ReqCastMemberDTO reqCastMemberDTO);
    void handleDeleteCastMember(UUID id);
}
