package com.example.Movie_Ticket_Booking_System.features.castmember;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ReqCastMemberDTO;
import com.example.Movie_Ticket_Booking_System.features.castmember.dto.ResCastMemberDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cast-members")
public class CastMemberController {

    private final CastMemberService castMemberService;

    public CastMemberController(CastMemberService castMemberService) {
        this.castMemberService = castMemberService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResCastMemberDTO>> createCastMember(@Valid @RequestBody ReqCastMemberDTO reqCastMemberDTO) {
        return ResponseEntity.status(201).body(ApiResponse.created(castMemberService.handleCreateCastMember(reqCastMemberDTO)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResCastMemberDTO>>> getAllCastMembers() {
        return ResponseEntity.ok(ApiResponse.success(castMemberService.handleGetAllCastMembers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResCastMemberDTO>> getCastMemberById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(castMemberService.handleGetCastMemberById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResCastMemberDTO>> updateCastMember(@PathVariable UUID id, @Valid @RequestBody ReqCastMemberDTO reqCastMemberDTO) {
        return ResponseEntity.ok(ApiResponse.success(castMemberService.handleUpdateCastMember(id, reqCastMemberDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCastMember(@PathVariable UUID id) {
        castMemberService.handleDeleteCastMember(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }
}
