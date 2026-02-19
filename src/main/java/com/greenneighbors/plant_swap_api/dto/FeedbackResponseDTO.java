package com.greenneighbors.plant_swap_api.dto;

import lombok.Data;

@Data
public class FeedbackResponseDTO {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Long reviewedMemberId;
    private String reviewedMemberName;
    private int rating;
    private String comments;
}