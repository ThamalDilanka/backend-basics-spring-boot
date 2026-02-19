package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.dto.ApiResponse;
import com.greenneighbors.plant_swap_api.dto.FeedbackResponseDTO;
import com.greenneighbors.plant_swap_api.model.Feedback;
import com.greenneighbors.plant_swap_api.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Helper method to convert Entity to DTO safely
    private FeedbackResponseDTO convertToDTO(Feedback feedback) {
        FeedbackResponseDTO dto = new FeedbackResponseDTO();
        dto.setId(feedback.getId());
        dto.setRating(feedback.getRating());
        dto.setComments(feedback.getComments());

        if (feedback.getReviewer() != null) {
            dto.setReviewerId(feedback.getReviewer().getId());
            dto.setReviewerName(feedback.getReviewer().getName());
        }
        if (feedback.getReviewedMember() != null) {
            dto.setReviewedMemberId(feedback.getReviewedMember().getId());
            dto.setReviewedMemberName(feedback.getReviewedMember().getName());
        }
        return dto;
    }

    // 1. POST Submit Feedback
    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackResponseDTO>> addFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackService.addFeedback(feedback);
        return ResponseEntity.ok(new ApiResponse<>(true, "Feedback submitted successfully", convertToDTO(savedFeedback)));
    }

    // 2. GET Member Feedback
    @GetMapping("/member/{memberId}")
    public ResponseEntity<ApiResponse<List<FeedbackResponseDTO>>> getMemberFeedback(@PathVariable Long memberId) {
        List<FeedbackResponseDTO> dtos = feedbackService.getFeedbackForMember(memberId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Feedback retrieved successfully", dtos));
    }
}