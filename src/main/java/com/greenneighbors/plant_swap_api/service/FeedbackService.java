package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.model.Feedback;
import com.greenneighbors.plant_swap_api.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback addFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }
}