package com.prestabanco.loan.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prestabanco.loan.models.LoanCalculation;
import com.prestabanco.loan.entity.Loan;
import com.prestabanco.loan.service.LoanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<?> requestLoan(
            @RequestParam("loanData") String loanData,
            @RequestParam(value = "incomeDocument", required = false) MultipartFile incomeDocument,
            @RequestParam(value = "appraisalCertificate", required = false) MultipartFile appraisalCertificate,
            @RequestParam(value = "historicalCredit", required = false) MultipartFile historicalCredit,
            @RequestParam(value = "firstHomeDeed", required = false) MultipartFile firstHomeDeed,
            @RequestParam(value = "businessFinancialState", required = false) MultipartFile businessFinancialState,
            @RequestParam(value = "businessPlan", required = false) MultipartFile businessPlan,
            @RequestParam(value = "remodelingBudget", required = false) MultipartFile remodelingBudget) {

        Logger logger = LoggerFactory.getLogger(LoanController.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            LoanCalculation loanCalculation = objectMapper.readValue(loanData, LoanCalculation.class);

            byte[] incomeDocumentBytes = incomeDocument != null? incomeDocument.getBytes() : null;
            byte[] appraisalCertificateBytes = appraisalCertificate != null ? appraisalCertificate.getBytes() : null;
            byte[] historicalCreditBytes = historicalCredit != null ? historicalCredit.getBytes() : null;
            byte[] firstHomeDeedBytes = firstHomeDeed != null ? firstHomeDeed.getBytes() : null;
            byte[] businessFinancialStateBytes = businessFinancialState != null ? businessFinancialState.getBytes() : null;
            byte[] businessPlanBytes = businessPlan != null ? businessPlan.getBytes() : null;
            byte[] remodelingBudgetBytes = remodelingBudget != null ? remodelingBudget.getBytes() : null;

            Loan loan = loanService.createLoan(loanCalculation, incomeDocumentBytes, appraisalCertificateBytes,
                    historicalCreditBytes, firstHomeDeedBytes, businessFinancialStateBytes, businessPlanBytes, remodelingBudgetBytes);

            return ResponseEntity.ok(Map.of("id", loan.getId()));
        } catch (Exception e) {
            logger.error("Error processing loan request", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid loan request");
        }
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Loan>> getLoansByUser(@PathVariable Long userId) {
        List<Loan> loans = loanService.getLoansByUser(userId);
        return ResponseEntity.ok(loans);
    }

}