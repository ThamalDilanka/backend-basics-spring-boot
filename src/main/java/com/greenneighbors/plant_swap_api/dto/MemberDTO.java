package com.greenneighbors.plant_swap_api.dto;

import lombok.Data;

@Data
public class MemberDTO {
    private Long id;
    private String name;
    private String email;
    private String neighborhood;
}