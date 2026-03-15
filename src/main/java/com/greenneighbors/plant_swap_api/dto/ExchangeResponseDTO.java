package com.greenneighbors.plant_swap_api.dto;

import lombok.Data;

@Data
public class ExchangeResponseDTO {
    private Long id;
    private String requesterName;
    private String requesterImageUrl;
    private String ownerName;
    private String ownerImageUrl;
    private String plantName;
    private String plantImageUrl;
    private String status;
    private String message;
    private String date;
}