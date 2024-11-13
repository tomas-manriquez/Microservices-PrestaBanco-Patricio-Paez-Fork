package com.prestabanco.loan.service;

import com.prestabanco.loan.entity.Loan;
import com.prestabanco.loan.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    public List<Loan> findAll() { return loanRepository.findAll(); }

    public Loan findById(int id) { return loanRepository.findById(id).get(); }

    public Loan save(Loan loan) { return loanRepository.save(loan); }

    public boolean deleteById(int id) throws Exception {
        try{
            loanRepository.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            throw new Exception("Error deleting loan", e);
        }
    }
}