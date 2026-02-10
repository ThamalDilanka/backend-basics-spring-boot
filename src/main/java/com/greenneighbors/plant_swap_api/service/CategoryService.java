package com.greenneighbors.plant_swap_api.service;

import com.greenneighbors.plant_swap_api.model.Category;
import com.greenneighbors.plant_swap_api.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // 1. Create a new category (e.g., "Ferns")
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // 2. Get all categories (to show in the dropdown list)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}