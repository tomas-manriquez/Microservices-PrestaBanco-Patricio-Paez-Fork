package com.prestabanco.income.service;

import com.prestabanco.income.entity.Income;
import com.prestabanco.income.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    public List<Income> findAll(){ return incomeRepository.findAll(); }

    public Income findById(int id){ return incomeRepository.findById(id).get(); }

    public Income save(Income income){ return incomeRepository.save(income); }

    public boolean deleteById(int id) throws Exception {
        try{
            incomeRepository.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            throw new Exception("Error deleting income", e);
        }
    }

    public Income findByIdCustomer(int id) {return incomeRepository.findByIdCustomer(id); }
}
