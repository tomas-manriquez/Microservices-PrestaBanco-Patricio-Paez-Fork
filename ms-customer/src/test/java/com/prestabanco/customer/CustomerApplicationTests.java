package com.prestabanco.customer;

import com.prestabanco.customer.models.UserLoginRequest;
import com.prestabanco.customer.models.UserLoginResponse;
import com.prestabanco.customer.models.UserRequest;
import com.prestabanco.customer.models.UserResponse;
import com.prestabanco.customer.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.prestabanco.customer.entity.User;
import com.prestabanco.customer.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.*;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class CustomerApplicationTests {

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private UserService userService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void registerUser_Success() {
		UserRequest request = new UserRequest();
		request.setEmail("test@example.com");
		request.setPassword("pass");
		when(userRepository.findFirstByEmail("test@example.com")).thenReturn(null);
		when(passwordEncoder.encode("pass")).thenReturn("hashed");
		when(userRepository.save(any(User.class))).thenReturn(new User());
		UserResponse response = userService.registerUser(request);

		assertEquals(1, response.getId());
		assertEquals("User registered successfully", response.getMessage());
	}

	@Test
	void registerUser_EmailAlreadyRegistered_ReturnsError() {
		UserRequest request = new UserRequest();
		request.setEmail("test@example.com");
		when(userRepository.findFirstByEmail("test@example.com")).thenReturn(new User());

		UserResponse response = userService.registerUser(request);

		assertEquals(2, response.getId());
		assertEquals("Email already registered", response.getMessage());
	}

	@Test
	void loginUser_UserNotFound() {
		UserLoginRequest request = new UserLoginRequest();
		request.setEmail("notfound@example.com");
		when(userRepository.findFirstByEmail("notfound@example.com")).thenReturn(null);

		UserLoginResponse response = userService.loginUser(request);

		assertNull(response.getUserId());
	}

	@Test
	void loginUser_PasswordMatches() {
		UserLoginRequest request = new UserLoginRequest();
		request.setEmail("test@example.com");
		request.setPassword("pass");
		User user = new User();
		user.setPassword("hashed");
		user.setId(2L);
		when(userRepository.findFirstByEmail("test@example.com")).thenReturn(user);
		when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);

		UserLoginResponse response = userService.loginUser(request);

		assertEquals(2L, response.getUserId());
	}

	@Test
	void loginUser_PasswordDoesNotMatch() {
		UserLoginRequest request = new UserLoginRequest();
		request.setEmail("test@example.com");
		request.setPassword("wrong");
		User user = new User();
		user.setPassword("hashed");
		when(userRepository.findFirstByEmail("test@example.com")).thenReturn(user);
		when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

		UserLoginResponse response = userService.loginUser(request);

		assertNull(response.getUserId());
	}

	@Test
	void getAllUsers_ReturnsList() {
		User user = new User();
		when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

		List<User> users = userService.getAllUsers();

		assertEquals(1, users.size());
	}

	@Test
	void updateUser_SavesUser() {
		User user = new User();
		when(userRepository.save(user)).thenReturn(user);

		User result = userService.updateUser(user);

		assertEquals(user, result);
	}

	@Test
	void getUserById_UserExists() {
		User user = new User();
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));

		User result = userService.getUserById(1L);

		assertEquals(user, result);
	}

	@Test
	void getUserById_UserNotFound() {
		when(userRepository.findById(1L)).thenReturn(Optional.empty());

		Exception exception = assertThrows(IllegalArgumentException.class, () -> userService.getUserById(1L));
		assertEquals("User not found", exception.getMessage());
	}

}
