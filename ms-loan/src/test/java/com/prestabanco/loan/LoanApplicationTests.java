package com.prestabanco.loan;

import com.prestabanco.loan.entity.Loan;
import com.prestabanco.loan.models.LoanCalculation;
import com.prestabanco.loan.repository.LoanRepository;
import com.prestabanco.loan.service.LoanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class LoanApplicationTests {

	@MockBean
	private LoanRepository loanRepository;

	@Autowired
	private LoanService loanService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void createLoan_Success() {
		LoanCalculation calc = new LoanCalculation();
		calc.setSelectedYears(10);
		calc.setSelectedLoan(1);
		calc.setSelectedInterest(4.0);
		calc.setPropertyValue(100000.0);
		calc.setUserId(1L);
		calc.setSelectedAmount(70000.0);

		Loan loan = new Loan();
		when(loanRepository.save(any(Loan.class))).thenReturn(loan);

		Loan result = loanService.createLoan(calc, new byte[1], new byte[1], new byte[1], new byte[1], new byte[1], new byte[1], new byte[1]);
		assertNotNull(result);
		verify(loanRepository).save(any(Loan.class));
	}

	@Test
	void findAll_ReturnsList() {
		Loan loan = new Loan();
		when(loanRepository.findAll()).thenReturn(Collections.singletonList(loan));
		List<Loan> result = loanService.findAll();
		assertEquals(1, result.size());
	}

	@Test
	void findById_Exists() {
		Loan loan = new Loan();
		when(loanRepository.findById(1L)).thenReturn(Optional.of(loan));
		Loan result = loanService.findById(1L);
		assertEquals(loan, result);
	}

	@Test
	void findById_NotFound() {
		when(loanRepository.findById(1L)).thenReturn(Optional.empty());
		Exception ex = assertThrows(IllegalArgumentException.class, () -> loanService.findById(1L));
		assertTrue(ex.getMessage().contains("Loan not found"));
	}

	@Test
	void getLoansByUser_ReturnsList() {
		Loan loan = new Loan();
		when(loanRepository.findByUserId(1L)).thenReturn(Collections.singletonList(loan));
		List<Loan> result = loanService.getLoansByUser(1L);
		assertEquals(1, result.size());
	}

	@Test
	void save_SavesLoan() {
		Loan loan = new Loan();
		when(loanRepository.save(loan)).thenReturn(loan);
		Loan result = loanService.save(loan);
		assertEquals(loan, result);
	}

	@Test
	void deleteById_DeletesLoan() {
		when(loanRepository.existsById(1L)).thenReturn(true);
		loanService.deleteById(1L);
		verify(loanRepository).deleteById(1L);
	}

	@Test
	void deleteById_NotFound() {
		when(loanRepository.existsById(1L)).thenReturn(false);
		Exception ex = assertThrows(IllegalArgumentException.class, () -> loanService.deleteById(1L));
		assertTrue(ex.getMessage().contains("Loan not found"));
	}

	@Test
	void calculateLoan_ValidInput_ReturnsMap() {
		Map<String, Object> result = loanService.calculateLoan(1, 100000, 10, 4.0, 70000);
		assertEquals(70000.0, result.get("loanAmount"));
		assertEquals(120, result.get("months"));
		assertTrue((double) result.get("monthlyFee") > 0);
	}

	@Test
	void calculateLoan_InvalidLoanType_Throws() {
		Exception ex = assertThrows(IllegalArgumentException.class, () -> loanService.calculateLoan(99, 100000, 10, 4.0, 70000));
		assertEquals("Invalid loan type", ex.getMessage());
	}

	@Test
	void calculateLoan_ExceedsMaxYears_Throws() {
		Exception ex = assertThrows(IllegalArgumentException.class, () -> loanService.calculateLoan(1, 100000, 40, 4.0, 70000));
		assertEquals("Exceeds maximum allowed years", ex.getMessage());
	}

	@Test
	void calculateLoan_ExceedsMaxAmount_Throws() {
		Exception ex = assertThrows(IllegalArgumentException.class, () -> loanService.calculateLoan(1, 100000, 10, 4.0, 90000));
		assertEquals("Selected amount exceeds maximum allowed loan amount", ex.getMessage());
	}

	@Test
	void calculateLoan_InterestOutOfRange_Throws() {
		Exception ex = assertThrows(IllegalArgumentException.class, () -> loanService.calculateLoan(1, 100000, 10, 10.0, 70000));
		assertEquals("Interest rate out of range", ex.getMessage());
	}
}
