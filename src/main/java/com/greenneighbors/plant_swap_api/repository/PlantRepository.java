package com.greenneighbors.plant_swap_api.repository;

import com.greenneighbors.plant_swap_api.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlantRepository extends JpaRepository<Plant, Long> {

    // Find all plants that are "AVAILABLE" (For the browse page)
    List<Plant> findByStatus(Plant.PlantStatus status);

    // Find all plants belonging to a specific user (For "My Plants" page)
    List<Plant> findByMemberId(Long memberId);

    // Find plants by category (e.g., all Succulents)
    List<Plant> findByCategoryId(Long categoryId);
}