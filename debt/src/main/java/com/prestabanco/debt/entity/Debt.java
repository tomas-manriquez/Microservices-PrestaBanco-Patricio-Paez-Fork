package com.prestabanco.debt.entity;

import java.sql.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Debt {

    @Id
    @GeneratedValue
    @Column(unique = true, nullable = false)
    private long idDebt;
    private Date debtDate;
    private int debtAmount;
}
