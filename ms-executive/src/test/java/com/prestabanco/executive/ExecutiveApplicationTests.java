package com.prestabanco.executive;

import com.prestabanco.executive.entity.Executive;
import com.prestabanco.executive.models.ExecutiveLoginRequest;
import com.prestabanco.executive.models.ExecutiveLoginResponse;
import com.prestabanco.executive.repository.ExecutiveRepository;
import com.prestabanco.executive.service.ExecutiveService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@SpringBootTest
class ExecutiveApplicationTests {

	@MockBean
	private ExecutiveRepository executiveRepository;

	@Autowired
	private ExecutiveService executiveService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void findById_ReturnsExecutive() {
		Executive executive = new Executive();
		executive.setId(1L);
		when(executiveRepository.findById(1L)).thenReturn(Optional.of(executive));

		Executive result = executiveService.findById(1L);

		assertEquals(1L, result.getId());
	}

	@Test
	void save_SavesExecutive() {
		Executive executive = new Executive();
		when(executiveRepository.save(executive)).thenReturn(executive);

		Executive result = executiveService.save(executive);

		assertEquals(executive, result);
	}

	@Test
	void loginExecutive_PasswordNull_ReturnsNull() {
		ExecutiveLoginRequest request = new ExecutiveLoginRequest();
		request.setEmail("test@example.com");
		Executive executive = new Executive();
		executive.setPassword(null);
		when(executiveRepository.findFirstByEmail("test@example.com")).thenReturn(executive);

		ExecutiveLoginResponse response = executiveService.loginExecutive(request);

		assertNull(response.getId());
	}

	@Test
	void loginExecutive_EmailNotNull_ReturnsId() {
		ExecutiveLoginRequest request = new ExecutiveLoginRequest();
		request.setEmail("test@example.com");
		Executive executive = new Executive();
		executive.setId(2L);
		executive.setEmail("test@example.com");
		executive.setPassword("pass");
		when(executiveRepository.findFirstByEmail("test@example.com")).thenReturn(executive);

		ExecutiveLoginResponse response = executiveService.loginExecutive(request);

		assertEquals(2L, response.getId());
	}

	@Test
	void loginExecutive_EmailNull_ReturnsNull() {
		ExecutiveLoginRequest request = new ExecutiveLoginRequest();
		request.setEmail("test@example.com");
		Executive executive = new Executive();
		executive.setPassword("pass");
		executive.setEmail(null);
		when(executiveRepository.findFirstByEmail("test@example.com")).thenReturn(executive);

		ExecutiveLoginResponse response = executiveService.loginExecutive(request);

		assertNull(response.getId());
	}
}