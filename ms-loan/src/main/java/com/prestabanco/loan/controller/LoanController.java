package com.prestabanco.loan.controller;

import com.prestabanco.loan.models.LoanCalculation;
import com.prestabanco.loan.entity.Loan;
import com.prestabanco.loan.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loan")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Loan>> list() {
        return ResponseEntity.ok(loanService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.findById(id));
    }

    @PostMapping("/request-loan")
    public ResponseEntity<Loan> requestLoan(@RequestBody Loan loanRequest) {
        Loan savedLoan = loanService.createLoan(loanRequest);
        return ResponseEntity.ok(savedLoan);
    }

    @PutMapping("/")
    public ResponseEntity<Loan> update(@RequestBody Loan loan) {
        return ResponseEntity.ok(loanService.save(loan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        loanService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calculate")
    public Map<String, Object> calculateLoan(@RequestBody LoanCalculation request) {
        return loanService.calculateLoan(
                request.getLoanType(),
                request.getPropertyValue(),
                request.getYears(),
                request.getInterestRate()
        );
    }
}