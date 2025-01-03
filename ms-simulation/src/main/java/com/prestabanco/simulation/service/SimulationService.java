package com.prestabanco.simulation.service;

import com.prestabanco.simulation.models.LoanSimulationRequest;
import com.prestabanco.simulation.models.LoanType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SimulationService {

    public Map<String, Object> calculateLoan(LoanSimulationRequest request) {
        validateRequestLoan(request);

        double maxLoanAmount = request.getPropertyValue() * request.getMaxPercentage();
        int months = request.getYears() * 12;
        double monthlyInterest = request.getInterestRate() / 12 / 100;

        double monthlyFee = maxLoanAmount *
                ((monthlyInterest * Math.pow(1 + monthlyInterest, months)) /
                        (Math.pow(1 + monthlyInterest, months) - 1));

        Map<String, Object> response = new HashMap<>();
        response.put("loanAmount", maxLoanAmount);
        response.put("monthlyFee", monthlyFee);
        response.put("annualInterest", request.getInterestRate());
        response.put("monthlyInterest", monthlyInterest);
        response.put("months", months);

        return response;
    }

    public Map<String, Object> calculateTotalCost(LoanSimulationRequest request) {
        Map<String, Object> loanData = calculateLoan(request);

        double loanAmount = (double) loanData.get("loanAmount");
        double monthlyFee = (double) loanData.get("monthlyFee");
        int months = (int) loanData.get("months");

        double adminFee = 0.01 * loanAmount;
        double reliefInsurance = 0.0003 * loanAmount;
        double fireInsurance = 20000;
        double monthlyCost = monthlyFee + reliefInsurance + fireInsurance;
        double totalCost = (monthlyCost * months) + adminFee;

        Map<String, Object> response = new HashMap<>();
        response.put("totalCost", totalCost);
        response.put("monthlyCost", monthlyCost);
        response.put("adminFee", adminFee);
        response.put("reliefInsurance", reliefInsurance);
        response.put("fireInsurance", fireInsurance);

        return response;
    }

    private void validateRequestLoan(LoanSimulationRequest request) {
        Map<Integer, LoanType> loanTypes = Map.of(
                1, new LoanType(3.5, 5, 0.8, 30), // First House
                2, new LoanType(4, 6, 0.7, 20), // Second House
                3, new LoanType(5, 7, 0.6, 25), // Commercial Properties
                4, new LoanType(4.5, 6, 0.5, 15) // Remodeling
        );

        LoanType selectedLoanType = loanTypes.get(request.getSelectedLoan());

        if (selectedLoanType == null) {
            throw new IllegalArgumentException("Invalid loan type selected");
        }

        if (request.getInterestRate() < selectedLoanType.getMinInterest() || request.getInterestRate() > selectedLoanType.getMaxInterest()) {
            throw new IllegalArgumentException("Interest rate out of range");
        }
        if (request.getYears() > selectedLoanType.getMaxYears()) {
            throw new IllegalArgumentException("Years exceed maximum allowed for this loan type");
        }
    }

}