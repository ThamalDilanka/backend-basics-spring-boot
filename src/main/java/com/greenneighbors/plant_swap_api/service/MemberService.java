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
        response.put("email", email);
        return response;
    }
}