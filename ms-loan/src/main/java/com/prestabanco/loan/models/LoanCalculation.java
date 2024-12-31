package com.prestabanco.loan.models;

import lombok.Data;

@Data
public class LoanCalculation {
    private Long userId;
    private int loanType;
    private Double propertyValue;
    private int years;
    private double interestRate;
    private int selectedLoan;
    private int selectedYears;
    private Double selectedAmount;
    private Double selectedInterest;

}
