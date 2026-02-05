package com.greenneighbors.plant_swap_api.repository;

import com.greenneighbors.plant_swap_api.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

}