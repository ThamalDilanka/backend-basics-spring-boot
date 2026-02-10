package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.model.ExchangeRequest;
import com.greenneighbors.plant_swap_api.service.ExchangeRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class ExchangeRequestController {

    @Autowired
    private ExchangeRequestService exchangeRequestService;

    // Create a swap request
    // POST http://localhost:8080/api/requests
    @PostMapping
    public ResponseEntity<ExchangeRequest> createRequest(@RequestBody ExchangeRequest request) {
        return ResponseEntity.ok(exchangeRequestService.createRequest(request));
    }

    // Get requests for a specific plant
    // GET http://localhost:8080/api/requests/plant/5
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<List<ExchangeRequest>> getRequestsForPlant(@PathVariable Long plantId) {
        return ResponseEntity.ok(exchangeRequestService.getRequestsForPlant(plantId));
    }

    // Update status (Accept/Reject)
    // PUT http://localhost:8080/api/requests/1/status?status=ACCEPTED
    @PutMapping("/{id}/status")
    public ResponseEntity<ExchangeRequest> updateStatus(@PathVariable Long id, @RequestParam ExchangeRequest.RequestStatus status) {
        return ResponseEntity.ok(exchangeRequestService.updateStatus(id, status));
    }
}