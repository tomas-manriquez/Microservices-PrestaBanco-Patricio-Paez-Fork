package com.prestabanco.request.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Loan {
    private Long idLoan;
    private int selectedYears;
    private int selectedLoan;
    private Double selectedInterest;
    private int selectedAmount;
    private Double propertyValue;
}
