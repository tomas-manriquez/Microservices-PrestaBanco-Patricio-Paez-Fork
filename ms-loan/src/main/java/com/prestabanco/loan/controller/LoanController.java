package com.prestabanco.loan.controller;

import com.prestabanco.loan.entity.Loan;
import com.prestabanco.loan.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @GetMapping("/")
    public ResponseEntity<List<Loan>> list() {
        List<Loan> loans = loanService.findAll();
        return ResponseEntity.ok(loans); }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> get(@PathVariable int id) {
        Loan loan = loanService.findById(id);
        return ResponseEntity.ok(loan); }

    @PostMapping("/")
    public ResponseEntity<Loan> save(@RequestBody Loan loan) {
        Loan loanNew = loanService.save(loan);
        return ResponseEntity.ok(loanNew); }

    @PutMapping("/")
    public ResponseEntity<Loan> update(@RequestBody Loan loan) {
        Loan loanNew = loanService.save(loan);
        return ResponseEntity.ok(loanNew); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable int id) throws Exception {
        var isDeleted = loanService.deleteById(id);
        return ResponseEntity.noContent().build();}

}