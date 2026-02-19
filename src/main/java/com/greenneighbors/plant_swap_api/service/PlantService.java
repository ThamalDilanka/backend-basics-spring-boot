package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.model.Plant;
import com.greenneighbors.plant_swap_api.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlantService {

    @Autowired
    private PlantRepository plantRepository;

    // Create
    public Plant addPlant(Plant plant) {
        return plantRepository.save(plant);
    }

    // Read All Available
    public List<Plant> getAllAvailablePlants() {
        return plantRepository.findByStatus(Plant.PlantStatus.AVAILABLE);
    }

    // Read One
    public Plant getPlantById(Long id) {
        return plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found with id: " + id));
    }

    // Read by Owner
    public List<Plant> getPlantsByMember(Long memberId) {
        return plantRepository.findByMemberId(memberId);
    }

    // Update
    public Plant updatePlant(Long id, Plant updatedData) {
        Plant existingPlant = getPlantById(id);
        existingPlant.setName(updatedData.getName());
        existingPlant.setDescription(updatedData.getDescription());
        existingPlant.setCareDifficulty(updatedData.getCareDifficulty());
        return plantRepository.save(existingPlant);
    }

    // Delete
    public void deletePlant(Long id) {
        Plant existingPlant = getPlantById(id);
        plantRepository.delete(existingPlant);
    }
}