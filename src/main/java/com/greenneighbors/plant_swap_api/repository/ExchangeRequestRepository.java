package com.greenneighbors.plant_swap_api.repository;

import com.greenneighbors.plant_swap_api.model.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {

    // Find requests made BY me
    List<ExchangeRequest> findByRequesterId(Long requesterId);

    // Find requests FOR my specific plant
    List<ExchangeRequest> findByPlantId(Long plantId);

    // Find incoming requests (people asking for my plants)
    List<ExchangeRequest> findByPlantMemberId(Long memberId);
}