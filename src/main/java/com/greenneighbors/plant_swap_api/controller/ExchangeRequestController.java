package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.dto.ApiResponse;
import com.greenneighbors.plant_swap_api.dto.ExchangeRequestDTO;
import com.greenneighbors.plant_swap_api.dto.ExchangeResponseDTO;
import com.greenneighbors.plant_swap_api.model.ExchangeRequest;
import com.greenneighbors.plant_swap_api.model.Member;
import com.greenneighbors.plant_swap_api.model.Plant;
import com.greenneighbors.plant_swap_api.service.ExchangeRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/requests") // Version 1!
@CrossOrigin(origins = "*")
public class ExchangeRequestController {

    @Autowired
    private ExchangeRequestService exchangeRequestService;

    // Helper to convert Entity to DTO
    private ExchangeResponseDTO convertToDTO(ExchangeRequest request) {
        ExchangeResponseDTO dto = new ExchangeResponseDTO();
        dto.setId(request.getId());
        dto.setMessage(request.getMessage());
        dto.setStatus(request.getStatus().name());
        if (request.getRequester() != null) dto.setRequesterName(request.getRequester().getName());
        if (request.getPlant() != null) dto.setPlantName(request.getPlant().getName());
        return dto;
    }

    // 1. Create a swap request (With Validation!)
    @PostMapping
    public ResponseEntity<ApiResponse<ExchangeResponseDTO>> createRequest(@Valid @RequestBody ExchangeRequestDTO dto) {
        ExchangeRequest request = new ExchangeRequest();
        request.setMessage(dto.getMessage());
        request.setStatus(ExchangeRequest.RequestStatus.PENDING);

        Member requester = new Member(); requester.setId(dto.getRequesterId());
        Plant plant = new Plant(); plant.setId(dto.getPlantId());

        request.setRequester(requester);
        request.setPlant(plant);

        ExchangeRequest savedRequest = exchangeRequestService.createRequest(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Exchange request submitted", convertToDTO(savedRequest)));
    }

    // 2. Get requests for a specific plant
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<ApiResponse<List<ExchangeResponseDTO>>> getRequestsForPlant(@PathVariable Long plantId) {
        List<ExchangeResponseDTO> dtos = exchangeRequestService.getRequestsForPlant(plantId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Requests retrieved", dtos));
    }

    // 3. Update status (Accept/Reject)
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ExchangeResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam ExchangeRequest.RequestStatus status) {

        ExchangeRequest updatedRequest = exchangeRequestService.updateStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Request status updated", convertToDTO(updatedRequest)));
    }
}