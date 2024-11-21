package com.prestabanco.debt.service;

import com.prestabanco.debt.entity.Debt;
import com.prestabanco.debt.repository.DebtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DebtService {

    @Autowired
    private DebtRepository debtRepository;

    public List<Debt> findAll() { return debtRepository.findAll(); }

    public Debt findById(int id) { return debtRepository.findById(id).get(); }

    public Debt save(Debt debt) { return debtRepository.save(debt); }

    public boolean deleteById(int id) throws Exception {
        try{
            debtRepository.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            throw new Exception("Error deleting debt", e);
        }
    }
}