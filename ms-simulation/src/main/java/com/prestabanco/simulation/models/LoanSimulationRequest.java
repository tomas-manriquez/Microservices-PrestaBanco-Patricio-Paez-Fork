package com.prestabanco.simulation.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoanSimulationRequest {
    private int selectedLoan;
    private double propertyValue;
    private int years;
    private double interestRate;
    private double maxPercentage;
}