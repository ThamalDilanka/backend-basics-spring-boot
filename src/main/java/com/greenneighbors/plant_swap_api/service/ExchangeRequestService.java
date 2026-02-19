package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.exception.BusinessRuleViolationException;
import com.greenneighbors.plant_swap_api.exception.ResourceNotFoundException;
import com.greenneighbors.plant_swap_api.model.ExchangeRequest;
import com.greenneighbors.plant_swap_api.repository.ExchangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExchangeRequestService {

    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    public ExchangeRequest createRequest(ExchangeRequest request) {
        return exchangeRequestRepository.save(request);
    }

    public List<ExchangeRequest> getRequestsForPlant(Long plantId) {
        return exchangeRequestRepository.findByPlantId(plantId);
    }

    // Helper to get one request safely
    public ExchangeRequest getRequestById(Long id) {
        return exchangeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found with ID: " + id));
    }

    public ExchangeRequest updateStatus(Long id, ExchangeRequest.RequestStatus newStatus) {
        ExchangeRequest request = getRequestById(id);

        // Business Rule: Cannot change status if already completed
        if (request.getStatus() == ExchangeRequest.RequestStatus.COMPLETED) {
            throw new BusinessRuleViolationException("Cannot change the status of an already completed exchange request.");
        }

        request.setStatus(newStatus);
        return exchangeRequestRepository.save(request);
    }
}