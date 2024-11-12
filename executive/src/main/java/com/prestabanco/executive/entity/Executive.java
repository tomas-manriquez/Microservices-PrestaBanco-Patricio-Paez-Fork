package com.prestabanco.executive.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Executive {

    @Id
    @GeneratedValue
    @Column(unique = true, nullable = false)
    private long idExecutive;
    private String email;
    private String password;

    @Column(unique = true, nullable = false)
    private String rut;
    private String name;
    private String dadSurname;
    private String motherSurname;
}