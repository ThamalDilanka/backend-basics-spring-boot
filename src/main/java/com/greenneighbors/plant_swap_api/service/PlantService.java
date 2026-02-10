package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.model.Plant;
import com.greenneighbors.plant_swap_api.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlantService {

    @Autowired
    private PlantRepository plantRepository;

    // Add a new plant
    public Plant addPlant(Plant plant) {
        return plantRepository.save(plant);
    }

    //  Get all AVAILABLE plants
    public List<Plant> getAllAvailablePlants() {
        return plantRepository.findByStatus(Plant.PlantStatus.AVAILABLE);
    }

    //  Get plants by owner (For "My Plants" page)
    public List<Plant> getPlantsByMember(Long memberId) {
        return plantRepository.findByMemberId(memberId);
    }

    //  Get plant by ID
    public Optional<Plant> getPlantById(Long id) {
        return plantRepository.findById(id);
    }
}