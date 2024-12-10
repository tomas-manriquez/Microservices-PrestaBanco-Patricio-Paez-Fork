package com.prestabanco.request.config;

import com.prestabanco.request.models.Loan;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-loan", path = "/api/loans")
public interface LoanFeignClient {

    @GetMapping("/user/{idUser}")
    List<Loan> getLoansByUser(@PathVariable("idUser") Long idUser);
}