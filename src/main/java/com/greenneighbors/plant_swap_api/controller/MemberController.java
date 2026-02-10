package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.model.Member;
import com.greenneighbors.plant_swap_api.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*") // Allow frontend
public class MemberController {

    @Autowired
    private MemberService memberService;

    // Register a new user
    // POST http://localhost:8080/api/members/register
    @PostMapping("/register")
    public ResponseEntity<Member> register(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.registerMember(member));
    }

    // 2. Get all users (Admin only use)
    // GET http://localhost:8080/api/members
    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }
}