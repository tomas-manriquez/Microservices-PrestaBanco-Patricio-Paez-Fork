package com.prestabanco.simulation.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoanType {
    private final double minInterest;
    private final double maxInterest;
    private final double maxPercentage;
    private final int maxYears;

}