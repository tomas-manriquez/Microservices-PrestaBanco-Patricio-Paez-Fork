package com.prestabanco.loan.models;

import lombok.Data;

@Data
public class LoanCalculation {
    private String loanType;
    private double propertyValue;
    private int years;
    private double interestRate;
}
