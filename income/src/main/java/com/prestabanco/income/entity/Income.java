package com.prestabanco.income.entity;

import java.sql.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Income {

    @Id
    @GeneratedValue
    @Column(unique = true, nullable = false) // Can be used for independant or dependant worker
    private long idIncome;
    private Date incomeDate;
    private int incomeAmount;
}