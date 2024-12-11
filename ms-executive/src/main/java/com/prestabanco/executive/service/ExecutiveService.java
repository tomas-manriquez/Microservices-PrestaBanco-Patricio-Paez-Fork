package com.prestabanco.executive.service;

import com.prestabanco.executive.entity.Executive;
import com.prestabanco.executive.models.ExecutiveLoginRequest;
import com.prestabanco.executive.models.ExecutiveLoginResponse;
import com.prestabanco.executive.repository.ExecutiveRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ExecutiveService {

    private final ExecutiveRepository executiveRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ExecutiveService(ExecutiveRepository executiveRepository, BCryptPasswordEncoder passwordEncoder) {
        this.executiveRepository = executiveRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Executive findById(long id) { return executiveRepository.findById(id).get(); }

    public Executive save(Executive executive) { return executiveRepository.save(executive); }

    public ExecutiveLoginResponse loginExecutive(ExecutiveLoginRequest request) {
        Executive executive = executiveRepository.findUExecutiveByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Executive not found"));

        if (passwordEncoder.matches(request.getPassword(), request.getPassword())) {
            return new ExecutiveLoginResponse(executive.getId());
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

}
