package com.prestabanco.request.config;

import com.prestabanco.request.models.Loan;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-loan", path = "/api/loan")
public interface LoanFeignClient {

    @GetMapping("/user/{userId}")
    List<Loan> getLoansByUser(@PathVariable("userId") Long userId);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteLoan(@PathVariable("id") Long id);
}