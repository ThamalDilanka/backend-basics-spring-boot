package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.model.Plant;
import com.greenneighbors.plant_swap_api.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
@CrossOrigin(origins = "*")
public class PlantController {

    @Autowired
    private PlantService plantService;

    // Add a new plant
    // POST http://localhost:8080/api/plants
    @PostMapping
    public ResponseEntity<Plant> addPlant(@RequestBody Plant plant) {
        return ResponseEntity.ok(plantService.addPlant(plant));
    }

    // Get all available plants
    // GET http://localhost:8080/api/plants
    @GetMapping
    public ResponseEntity<List<Plant>> getAllPlants() {
        return ResponseEntity.ok(plantService.getAllAvailablePlants());
    }

    // Get plants by owner
    // GET http://localhost:8080/api/plants/owner/1
    @GetMapping("/owner/{id}")
    public ResponseEntity<List<Plant>> getPlantsByOwner(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantsByMember(id));
    }
}