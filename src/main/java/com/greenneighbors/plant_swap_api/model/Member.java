package com.greenneighbors.plant_swap_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "members")
@Data // Generates Getters, Setters
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private String neighborhood;

    @OneToMany(mappedBy = "member")
    private List<Plant> plants;

    @OneToMany(mappedBy = "requester")
    private List<ExchangeRequest> requests;
}