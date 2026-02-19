package com.greenneighbors.plant_swap_api.dto;

import com.greenneighbors.plant_swap_api.model.Plant.CareDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlantRequestDTO {

    @NotBlank(message = "Plant name cannot be empty")
    private String name;

    private String description;

    @NotNull(message = "Care difficulty must be valid enum value (EASY, MEDIUM, HARD)")
    private CareDifficulty careDifficulty;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Member ID is required")
    private Long memberId;
}