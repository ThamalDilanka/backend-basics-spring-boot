package com.greenneighbors.plant_swap_api.dto;

import lombok.Data;

@Data
public class ExchangeResponseDTO {
    private Long id;
    private String requesterName;
    private String plantName;
    private String status;
    private String message;
}