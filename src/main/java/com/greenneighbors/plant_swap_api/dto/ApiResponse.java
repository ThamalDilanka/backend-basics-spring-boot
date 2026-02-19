package com.greenneighbors.plant_swap_api.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data; // can hold ANY type of data
    private String timestamp;

    // Constructor to easily create this object
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = Instant.now().toString();
    }
}