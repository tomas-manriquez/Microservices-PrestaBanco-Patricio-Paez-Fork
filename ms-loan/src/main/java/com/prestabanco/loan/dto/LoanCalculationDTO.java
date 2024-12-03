package com.prestabanco.loan.dto;

import lombok.Data;

@Data
public class LoanCalculationDTO {
    private String loanType;
    private double propertyValue;
    private int years;
    private double interestRate;
}
