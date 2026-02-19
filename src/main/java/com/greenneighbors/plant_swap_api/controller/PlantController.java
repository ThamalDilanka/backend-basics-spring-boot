package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.dto.ApiResponse;
import com.greenneighbors.plant_swap_api.dto.PlantRequestDTO;
import com.greenneighbors.plant_swap_api.dto.PlantResponseDTO;
import com.greenneighbors.plant_swap_api.model.Category;
import com.greenneighbors.plant_swap_api.model.Member;
import com.greenneighbors.plant_swap_api.model.Plant;
import com.greenneighbors.plant_swap_api.service.PlantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/plants") // Version 1!
@CrossOrigin(origins = "*")
public class PlantController {

    @Autowired
    private PlantService plantService;

    // Helper to convert Entity to DTO
    private PlantResponseDTO convertToDTO(Plant plant) {
        PlantResponseDTO dto = new PlantResponseDTO();
        dto.setId(plant.getId());
        dto.setName(plant.getName());
        dto.setDescription(plant.getDescription());
        dto.setStatus(plant.getStatus().name());
        if (plant.getCareDifficulty() != null) {
            dto.setCareDifficulty(plant.getCareDifficulty().name());
        }
        if (plant.getCategory() != null) dto.setCategoryName(plant.getCategory().getName());
        if (plant.getMember() != null) dto.setOwnerName(plant.getMember().getName());
        return dto;
    }

    // 1. CREATE Plant
    @PostMapping
    public ResponseEntity<ApiResponse<PlantResponseDTO>> addPlant(@Valid @RequestBody PlantRequestDTO requestDTO) {
        Plant plant = new Plant();
        plant.setName(requestDTO.getName());
        plant.setDescription(requestDTO.getDescription());
        plant.setCareDifficulty(requestDTO.getCareDifficulty());
        plant.setStatus(Plant.PlantStatus.AVAILABLE);

        Category category = new Category(); category.setId(requestDTO.getCategoryId());
        Member member = new Member(); member.setId(requestDTO.getMemberId());
        plant.setCategory(category);
        plant.setMember(member);

        Plant savedPlant = plantService.addPlant(plant);
        return ResponseEntity.ok(new ApiResponse<>(true, "Plant created", convertToDTO(savedPlant)));
    }

    // 2. GET ALL Available Plants
    @GetMapping
    public ResponseEntity<ApiResponse<List<PlantResponseDTO>>> getAllPlants() {
        List<PlantResponseDTO> dtos = plantService.getAllAvailablePlants().stream()
                .map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Plants retrieved", dtos));
    }

    // 3. GET ONE Plant
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlantResponseDTO>> getPlant(@PathVariable Long id) {
        Plant plant = plantService.getPlantById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Plant found", convertToDTO(plant)));
    }

    // 4. UPDATE Plant
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlantResponseDTO>> updatePlant(@PathVariable Long id, @Valid @RequestBody PlantRequestDTO requestDTO) {
        Plant updatedData = new Plant();
        updatedData.setName(requestDTO.getName());
        updatedData.setDescription(requestDTO.getDescription());
        updatedData.setCareDifficulty(requestDTO.getCareDifficulty());

        Plant savedPlant = plantService.updatePlant(id, updatedData);
        return ResponseEntity.ok(new ApiResponse<>(true, "Plant updated", convertToDTO(savedPlant)));
    }

    // 5. DELETE Plant
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Plant deleted successfully", null));
    }
}