package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.model.Member;
import com.greenneighbors.plant_swap_api.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new member
    public Member registerMember(Member member) {

        // Check if email is already taken
        if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken!");
        }

        // SCRAMBLE the password
        String plainPassword = member.getPassword();
        String scrambledPassword = passwordEncoder.encode(plainPassword);

        //  Set the scrambled password back to the member object
        member.setPassword(scrambledPassword);

        // Save to database (Only hash version saved)
        return memberRepository.save(member);
    }

    // Get all members
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // Get member by ID
    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }
}