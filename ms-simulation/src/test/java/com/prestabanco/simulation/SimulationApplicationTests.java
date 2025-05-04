package com.prestabanco.simulation;

import com.prestabanco.simulation.models.LoanSimulationRequest;
import com.prestabanco.simulation.service.SimulationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class SimulationApplicationTests {

	private SimulationService simulationService;

	@BeforeEach
	void setUp() {
		simulationService = new SimulationService();
	}

	@Test
	void calculateLoan_ValidRequest_ReturnsCorrectMap() {
		LoanSimulationRequest request = new LoanSimulationRequest();
		request.setSelectedLoan(1);
		request.setPropertyValue(100000);
		request.setMaxPercentage(0.8);
		request.setYears(20);
		request.setInterestRate(4.0);

		Map<String, Object> result = simulationService.calculateLoan(request);

		assertNotNull(result.get("loanAmount"));
		assertNotNull(result.get("monthlyFee"));
		assertEquals(240, result.get("months"));
		assertEquals(4.0, result.get("annualInterest"));
	}

	@Test
	void calculateLoan_InvalidLoanType_Throws() {
		LoanSimulationRequest request = new LoanSimulationRequest();
		request.setSelectedLoan(99);
		request.setPropertyValue(100000);
		request.setMaxPercentage(0.8);
		request.setYears(20);
		request.setInterestRate(4.0);

		Exception ex = assertThrows(IllegalArgumentException.class, () -> simulationService.calculateLoan(request));
		assertEquals("Invalid loan type selected", ex.getMessage());
	}

	@Test
	void calculateLoan_InterestOutOfRange_Throws() {
		LoanSimulationRequest request = new LoanSimulationRequest();
		request.setSelectedLoan(1);
		request.setPropertyValue(100000);
		request.setMaxPercentage(0.8);
		request.setYears(20);
		request.setInterestRate(10.0);

		Exception ex = assertThrows(IllegalArgumentException.class, () -> simulationService.calculateLoan(request));
		assertEquals("Interest rate out of range", ex.getMessage());
	}

	@Test
	void calculateLoan_YearsExceedMax_Throws() {
		LoanSimulationRequest request = new LoanSimulationRequest();
		request.setSelectedLoan(1);
		request.setPropertyValue(100000);
		request.setMaxPercentage(0.8);
		request.setYears(40);
		request.setInterestRate(4.0);

		Exception ex = assertThrows(IllegalArgumentException.class, () -> simulationService.calculateLoan(request));
		assertEquals("Years exceed maximum allowed for this loan type", ex.getMessage());
	}

	@Test
	void calculateTotalCost_ValidRequest_ReturnsCorrectMap() {
		LoanSimulationRequest request = new LoanSimulationRequest();
		request.setSelectedLoan(1);
		request.setPropertyValue(100000);
		request.setMaxPercentage(0.8);
		request.setYears(20);
		request.setInterestRate(4.0);

		Map<String, Object> result = simulationService.calculateTotalCost(request);

		assertNotNull(result.get("totalCost"));
		assertNotNull(result.get("monthlyCost"));
		assertNotNull(result.get("adminFee"));
		assertNotNull(result.get("reliefInsurance"));
		assertNotNull(result.get("fireInsurance"));
	}
}
