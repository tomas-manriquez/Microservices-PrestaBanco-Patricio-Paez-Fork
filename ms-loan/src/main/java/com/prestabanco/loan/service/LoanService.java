package com.prestabanco.loan.service;

import com.prestabanco.loan.entity.Loan;
import com.prestabanco.loan.models.LoanCalculation;
import com.prestabanco.loan.models.LoanType;
import com.prestabanco.loan.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LoanService {

    private final LoanRepository loanRepository;

    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    @Transactional
    public Loan createLoan(LoanCalculation loanCalculation, byte[] incomeDocument, byte[] appraisalCertificate,
                           byte[] historicalCredit, byte[] firstHomeDeed, byte[] businessFinancialState,
                           byte[] businessPlan, byte[] remodelingBudget) {
        Loan loan = new Loan();
        loan.setSelectedYears(loanCalculation.getSelectedYears());
        loan.setSelectedLoan(loanCalculation.getSelectedLoan());
        loan.setSelectedInterest(loanCalculation.getSelectedInterest());
        loan.setPropertyValue(loanCalculation.getPropertyValue());
        loan.setUserId(loanCalculation.getUserId());
        loan.setIncomeDocument(incomeDocument);
        loan.setAppraisalCertificate(appraisalCertificate);
        loan.setHistoricalCredit(historicalCredit);
        loan.setFirstHomeDeed(firstHomeDeed);
        loan.setBusinessFinancialState(businessFinancialState);
        loan.setBusinessPlan(businessPlan);
        loan.setRemodelingBudget(remodelingBudget);
        loan.setSelectedAmount(loanCalculation.getSelectedAmount()); // Add this line
        return loanRepository.save(loan);
    }

    public List<Loan> findAll() {
        return loanRepository.findAll();
    }

    public Loan findById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found with id: " + id));
    }

    public List<Loan> getLoansByUser(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public Loan save(Loan loan) {
        return loanRepository.save(loan);
    }

    public void deleteById(Long id) {
        if (!loanRepository.existsById(id)) {
            throw new IllegalArgumentException("Loan not found with id: " + id);
        }
        loanRepository.deleteById(id);
    }

    public Map<String, Object> calculateLoan(int loanType, double propertyValue, int years, double interestRate, double selectedAmount) {
        Map<Integer, LoanType> loanTypes = Map.of(
                1, new LoanType(3.5, 5, 0.8, 30), // First House
                2, new LoanType(4, 6, 0.7, 20), // Second House
                3, new LoanType(5, 7, 0.6, 25), // Commercial Properties
                4, new LoanType(4.5, 6, 0.5, 15) // Remodeling
        );

        LoanType selectedLoanType = loanTypes.get(loanType);

        if (selectedLoanType == null) {
            throw new IllegalArgumentException("Invalid loan type");
        }

        if (years > selectedLoanType.getMaxYears()) {
            throw new IllegalArgumentException("Exceeds maximum allowed years");
        }

        double maxLoanAmount = propertyValue * selectedLoanType.getMaxPercentage();
        if (selectedAmount > maxLoanAmount) {
            throw new IllegalArgumentException("Selected amount exceeds maximum allowed loan amount");
        }

        if (interestRate < selectedLoanType.getMinInterest() || interestRate > selectedLoanType.getMaxInterest()) {
            throw new IllegalArgumentException("Interest rate out of range");
        }

        int months = years * 12;
        double monthlyInterest = interestRate / 12 / 100;
        double monthlyFee = selectedAmount *
                (monthlyInterest * Math.pow(1 + monthlyInterest, months) /
                        (Math.pow(1 + monthlyInterest, months) - 1));

        Map<String, Object> response = new HashMap<>();
        response.put("loanAmount", selectedAmount);
        response.put("monthlyFee", monthlyFee);
        response.put("annualInterest", interestRate);
        response.put("monthlyInterest", monthlyInterest);
        response.put("months", months);

        return response;
    }

}