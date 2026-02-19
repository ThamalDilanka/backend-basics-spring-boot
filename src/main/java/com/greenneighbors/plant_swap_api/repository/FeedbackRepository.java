package com.greenneighbors.plant_swap_api.repository;

import com.greenneighbors.plant_swap_api.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Find all feedback given TO a specific member
    List<Feedback> findByReviewedMemberId(Long memberId);
}