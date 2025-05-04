package com.prestabanco.request;

import com.prestabanco.request.config.LoanFeignClient;
import com.prestabanco.request.entity.Request;
import com.prestabanco.request.models.Loan;
import com.prestabanco.request.models.RequestUpdate;
import com.prestabanco.request.repository.RequestRepository;
import com.prestabanco.request.service.RequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

@SpringBootTest
class RequestApplicationTests {

	@Mock
	private RequestRepository requestRepository;

	@Mock
	private LoanFeignClient loanFeignClient;

	@InjectMocks
	private RequestService requestService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void findAll_ReturnsList() {
		Request req = new Request();
		when(requestRepository.findAll()).thenReturn(Collections.singletonList(req));
		List<Request> result = requestService.findAll();
		assertEquals(1, result.size());
	}

	@Test
	void findById_ReturnsRequest() {
		Request req = new Request();
		when(requestRepository.findById(1)).thenReturn(Optional.of(req));
		Request result = requestService.findById(1);
		assertEquals(req, result);
	}

	@Test
	void save_SavesRequest() {
		Request req = new Request();
		when(requestRepository.save(req)).thenReturn(req);
		Request result = requestService.save(req);
		assertEquals(req, result);
	}

	@Test
	void deleteById_DeletesRequestAndLoan() throws Exception {
		Request req = new Request();
		req.setIdLoan(10L);
		when(requestRepository.findById(1)).thenReturn(Optional.of(req));
		doNothing().when(loanFeignClient).deleteLoan(10L);
		doNothing().when(requestRepository).deleteById(1);

		boolean result = requestService.deleteById(1);

		assertTrue(result);
		verify(loanFeignClient).deleteLoan(10L);
		verify(requestRepository).deleteById(1);
	}

	@Test
	void deleteById_ThrowsExceptionOnError() {
		when(requestRepository.findById(1)).thenThrow(new RuntimeException("DB error"));
		Exception ex = assertThrows(Exception.class, () -> requestService.deleteById(1));
		assertTrue(ex.getMessage().contains("Error deleting request"));
	}

	@Test
	void getRequestsByUser_ReturnsList() {
		Loan loan = new Loan();
		loan.setId(5L);
		when(loanFeignClient.getLoansByUser(2L)).thenReturn(Collections.singletonList(loan));
		Request req = new Request();
		req.setIdLoan(5L);
		when(requestRepository.findByIdLoanIn(Collections.singletonList(5L))).thenReturn(Collections.singletonList(req));

		List<Map<String, Object>> result = requestService.getRequestsByUser(2L);

		assertEquals(1, result.size());
		assertEquals(req, result.get(0).get("request"));
		assertEquals(loan, result.get(0).get("loan"));
	}

	@Test
	void getRequestsByUser_NoLoans_ReturnsEmptyList() {
		when(loanFeignClient.getLoansByUser(2L)).thenReturn(Collections.emptyList());
		List<Map<String, Object>> result = requestService.getRequestsByUser(2L);
		assertTrue(result.isEmpty());
	}

	@Test
	void update_UpdatesStatus() {
		RequestUpdate update = new RequestUpdate();
		update.setId(1);
		update.setStatus(3);
		Request req = new Request();
		when(requestRepository.findById(1)).thenReturn(Optional.of(req));
		when(requestRepository.save(req)).thenReturn(req);

		Request result = requestService.update(update);

		assertEquals(req, result);
		assertEquals(3, req.getStatus());
	}

}
