package com.prestabanco.loan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int selectedYears;
    private int selectedLoan; // 1 its firstHome 2 its SecondHome 3 CommercialProperties 4 Remodeling
    private Double selectedInterest;
    private Double propertyValue;

    private Long userId;

    @Column(columnDefinition = "BYTEA",name = "income_document", nullable = true)
    private byte[] incomeDocument;
    @Column(columnDefinition = "BYTEA",name = "appraisal_certificate", nullable = true)
    private byte[] appraisalCertificate;
    @Column(columnDefinition = "BYTEA",name = "business_financial_state", nullable = true)
    private byte[] businessFinancialState;
    @Column(columnDefinition = "BYTEA",name = "business_plan", nullable = true)
    private byte[] businessPlan;
    @Column(columnDefinition = "BYTEA",name = "first_home_deed", nullable = true)
    private byte[] firstHomeDeed;
    @Column(columnDefinition = "BYTEA",name = "historical_credit", nullable = true)
    private byte[] historicalCredit;
    @Column(columnDefinition = "BYTEA",name = "remodeling_budget", nullable = true)
    private byte[] remodelingBudget;

}