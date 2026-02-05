package com.greenneighbors.plant_swap_api.repository;

import com.greenneighbors.plant_swap_api.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // Custom query to find a user by email (for login)
    Optional<Member> findByEmail(String email);
}