package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.dto.ApiResponse;
import com.greenneighbors.plant_swap_api.dto.PlantRequestDTO;
import com.greenneighbors.plant_swap_api.dto.PlantResponseDTO;
import com.greenneighbors.plant_swap_api.exception.ResourceNotFoundException;
import com.greenneighbors.plant_swap_api.model.Category;
import com.greenneighbors.plant_swap_api.model.Member;
import com.greenneighbors.plant_swap_api.model.Plant;
import com.greenneighbors.plant_swap_api.repository.CategoryRepository;
import com.greenneighbors.plant_swap_api.repository.MemberRepository;
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

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MemberRepository memberRepository;

    // Helper to convert Entity to DTO
    private PlantResponseDTO convertToDTO(Plant plant) {
        PlantResponseDTO dto = new PlantResponseDTO();
        dto.setId(plant.getId());
        dto.setName(plant.getName());
        dto.setDescription(plant.getDescription());
        dto.setImageUrl(plant.getImageUrl());
        dto.setStatus(plant.getStatus().name());
        dto.setCreatedAt(plant.getCreatedAt());

        if (plant.getCareDifficulty() != null) {
            dto.setCareDifficulty(plant.getCareDifficulty().name());
        }
        if (plant.getCategory() != null)
            dto.setCategoryName(plant.getCategory().getName());
        if (plant.getMember() != null) {
            dto.setOwnerId(plant.getMember().getId());
            dto.setOwnerName(plant.getMember().getName());
            dto.setOwnerImageUrl(plant.getMember().getProfilePicture());
        }
        return dto;
    }

    // 1. CREATE Plant
    @PostMapping
    public ResponseEntity<ApiResponse<PlantResponseDTO>> addPlant(@Valid @RequestBody PlantRequestDTO requestDTO) {
        Plant plant = new Plant();
        plant.setName(requestDTO.getName());
        plant.setDescription(requestDTO.getDescription());
        plant.setImageUrl(requestDTO.getImageUrl());
        plant.setCareDifficulty(requestDTO.getCareDifficulty());
        plant.setStatus(Plant.PlantStatus.AVAILABLE);

        Category category = categoryRepository.findById(requestDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Member member = memberRepository.findById(requestDTO.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

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
    public ResponseEntity<ApiResponse<PlantResponseDTO>> updatePlant(@PathVariable Long id,
            @Valid @RequestBody PlantRequestDTO requestDTO) {
        Plant updatedData = new Plant();
        updatedData.setName(requestDTO.getName());
        updatedData.setDescription(requestDTO.getDescription());
        updatedData.setImageUrl(requestDTO.getImageUrl());
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

    // 6. GET Plants by Member ID
    @GetMapping("/member/{memberId}")
    public ResponseEntity<ApiResponse<List<PlantResponseDTO>>> getPlantsByMember(@PathVariable Long memberId) {
        List<PlantResponseDTO> dtos = plantService.getPlantsByMember(memberId).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Member's plants retrieved", dtos));
    }

    // Partial Update (Status only)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PlantResponseDTO>> updatePlantStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> updates) {

        Plant.PlantStatus status = Plant.PlantStatus.valueOf(updates.get("status").toUpperCase());
        Plant updatedPlant = plantService.updatePlantStatus(id, status);

        return ResponseEntity.ok(new ApiResponse<>(true, "Plant status updated", convertToDTO(updatedPlant)));
    }
}