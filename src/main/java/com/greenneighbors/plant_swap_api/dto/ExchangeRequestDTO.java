package com.greenneighbors.plant_swap_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExchangeRequestDTO {

    @NotNull(message = "Requester ID is required")
    private Long requesterId;

    @NotNull(message = "Plant ID is required")
    private Long plantId;

    @NotBlank(message = "Exchange request must include a message")
    private String message;
}