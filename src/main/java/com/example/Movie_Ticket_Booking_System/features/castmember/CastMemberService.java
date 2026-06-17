package com.example.Movie_Ticket_Booking_System.features.castmember;

import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ReqCastMemberDTO;
import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ResCastMemberDTO;

import java.util.List;

public interface CastMemberService {
    ResCastMemberDTO handleCreateCastMember(ReqCastMemberDTO reqCastMemberDTO);
    List<ResCastMemberDTO> handleGetAllCastMembers();
    ResCastMemberDTO handleGetCastMemberById(Integer id);
    ResCastMemberDTO handleUpdateCastMember(Integer id, ReqCastMemberDTO reqCastMemberDTO);
    void handleDeleteCastMember(Integer id);
}
