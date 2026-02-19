package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.dto.ApiResponse;
import com.greenneighbors.plant_swap_api.dto.LoginRequest;
import com.greenneighbors.plant_swap_api.dto.MemberDTO;
import com.greenneighbors.plant_swap_api.model.Member;
import com.greenneighbors.plant_swap_api.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/members") // CHANGED: Added /v1
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // Helper method to convert Entity to DTO
    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setName(member.getName());
        dto.setEmail(member.getEmail());
        dto.setNeighborhood(member.getNeighborhood());
        return dto;
    }

    // 1. Register a new user
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<MemberDTO>> register(@RequestBody Member member) {
        Member savedMember = memberService.registerMember(member);
        MemberDTO dto = convertToDTO(savedMember);

        ApiResponse<MemberDTO> response = new ApiResponse<>(true, "Member registered successfully", dto);
        return ResponseEntity.ok(response);
    }

    // 2. Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, String> tokenData = memberService.loginMember(loginRequest.getEmail(), loginRequest.getPassword());

        ApiResponse<Map<String, String>> response = new ApiResponse<>(true, "Login successful", tokenData);
        return ResponseEntity.ok(response);
    }

    // 3. Get all users
    @GetMapping
    public ResponseEntity<ApiResponse<List<MemberDTO>>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();

        // Convert all Members to MemberDTOs
        List<MemberDTO> dtos = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        ApiResponse<List<MemberDTO>> response = new ApiResponse<>(true, "Members retrieved successfully", dtos);
        return ResponseEntity.ok(response);
    }
}