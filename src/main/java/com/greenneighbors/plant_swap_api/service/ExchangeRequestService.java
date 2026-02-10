package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.model.ExchangeRequest;
import com.greenneighbors.plant_swap_api.model.Plant;
import com.greenneighbors.plant_swap_api.repository.ExchangeRequestRepository;
import com.greenneighbors.plant_swap_api.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExchangeRequestService {

    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    @Autowired
    private PlantRepository plantRepository;

    // Create a new request
    public ExchangeRequest createRequest(ExchangeRequest request) {
        // Basic validation:- Can not request your own plant
        if (request.getRequester().getId().equals(request.getPlant().getMember().getId())) {
            throw new RuntimeException("You cannot request your own plant!");
        }
        return exchangeRequestRepository.save(request);
    }

    // Get requests for a specific plant
    public List<ExchangeRequest> getRequestsForPlant(Long plantId) {
        return exchangeRequestRepository.findByPlantId(plantId);
    }

    // Update request status (Accept/Reject)
    public ExchangeRequest updateStatus(Long requestId, ExchangeRequest.RequestStatus newStatus) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(newStatus);

        // If ACCEPTED, mark the plant as "PENDING_EXCHANGE"
        if (newStatus == ExchangeRequest.RequestStatus.ACCEPTED) {
            Plant plant = request.getPlant();
            plant.setStatus(Plant.PlantStatus.PENDING_EXCHANGE);
            plantRepository.save(plant);
        }

        return exchangeRequestRepository.save(request);
    }
}