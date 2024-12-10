package com.prestabanco.simulation.service;

import com.prestabanco.simulation.models.LoanSimulationRequest;
import com.prestabanco.simulation.models.TotalCostRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SimulationService {

    public Map<String, Object> calculateLoan(LoanSimulationRequest request) {
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

    public Map<String, Object> calculateTotalCost(TotalCostRequest request) {
        double maxLoanAmount = request.getPropertyValue() * request.getMaxPercentage();
        int months = request.getYears() * 12;
        double monthlyInterest = request.getInterestRate() / 12 / 100;

        double monthlyFee = maxLoanAmount *
                ((monthlyInterest * Math.pow(1 + monthlyInterest, months)) /
                        (Math.pow(1 + monthlyInterest, months) - 1));

        double insuranceCost = request.getInsuranceRate() * maxLoanAmount;
        double fixedCosts = request.getFixedMonthlyCost() * months;
        double adminFee = request.getAdminFeeRate() * maxLoanAmount;

        double totalCost = (monthlyFee * months) + insuranceCost + fixedCosts + adminFee;

        Map<String, Object> response = new HashMap<>();
        response.put("loanAmount", maxLoanAmount);
        response.put("monthlyFee", monthlyFee);
        response.put("totalCost", totalCost);
        response.put("insuranceCost", insuranceCost);
        response.put("fixedCosts", fixedCosts);
        response.put("adminFee", adminFee);

        return response;
    }
}
