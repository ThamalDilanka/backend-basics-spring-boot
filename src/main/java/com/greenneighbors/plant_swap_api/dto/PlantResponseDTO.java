package com.greenneighbors.plant_swap_api.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlantResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String status;
    private String careDifficulty;
    private String categoryName;
    private String ownerName;
    private LocalDateTime createdAt;
}