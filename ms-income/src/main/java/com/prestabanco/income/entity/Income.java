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
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Can be used for independant or dependant worker
    private int idIncome;
    private Date incomeDate;
    private int incomeAmount;
    private int idCustomer;
}