package com.prestabanco.customer.service;

import com.prestabanco.customer.entity.User;
import com.prestabanco.customer.models.*;
import com.prestabanco.customer.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse registerUser(UserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLatePayments(false);
        user.setAmountOfLatePayments(0);
        user.setMinCashOnAccount(false);
        user.setConsistentSaveHistory(false);
        user.setPeriodicDeposits(false);
        user.setRelationYearsAndBalance(false);
        user.setRecentWithdraws(false);
        user.setWorking(false);
        user.setWorkingYears(0);
        user.setIndependentWorker(false);
        userRepository.save(user);

        return new UserResponse(user.getId(), "User registered successfully");
    }

    public UserLoginResponse loginUser(UserLoginRequest request) {
        System.out.println("Request received: " + request.getEmail());
        User user = userRepository.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new UserLoginResponse(user.getId());
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}