package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.config.JwtUtil;
import com.greenneighbors.plant_swap_api.exception.BusinessRuleViolationException;
import com.greenneighbors.plant_swap_api.exception.DuplicateResourceException;
import com.greenneighbors.plant_swap_api.exception.ResourceNotFoundException;
import com.greenneighbors.plant_swap_api.model.Member;
import com.greenneighbors.plant_swap_api.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 1. Register Member (Check for Duplicates!)
    public Member registerMember(Member member) {
        if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email is already in use: " + member.getEmail());
        }
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        return memberRepository.save(member);
    }

    // 2. Get All Members
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // 3. Login Member (Handle Not Found and Bad Passwords)
    public Map<String, String> loginMember(String email, String plainPassword) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with email: " + email));

        if (!passwordEncoder.matches(plainPassword, member.getPassword())) {
            throw new BusinessRuleViolationException("Invalid password provided.");
        }

        String token = jwtUtil.generateToken(email);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("memberId", String.valueOf(member.getId()));
        response.put("email", email);
        response.put("name", member.getName()); // <-- ADDING NAME HERE
        if (member.getProfilePicture() != null) {
            response.put("profilePicture", member.getProfilePicture());
        }
        return response;
    }

    // 4. Get Member by ID
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    // 5. Update Member
    public Member updateMember(Long id, Member updatedData) {
        Member existingMember = getMemberById(id);
        if (updatedData.getName() != null) {
            existingMember.setName(updatedData.getName());
        }
        if (updatedData.getNeighborhood() != null) {
            existingMember.setNeighborhood(updatedData.getNeighborhood());
        }
        return memberRepository.save(existingMember);
    }
}