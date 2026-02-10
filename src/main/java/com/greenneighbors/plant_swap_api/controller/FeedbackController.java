package com.greenneighbors.plant_swap_api.controller;

import com.greenneighbors.plant_swap_api.model.Feedback;
import com.greenneighbors.plant_swap_api.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Add feedback
    // POST http://localhost:8080/api/feedback
    @PostMapping
    public ResponseEntity<Feedback> addFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.addFeedback(feedback));
    }
}