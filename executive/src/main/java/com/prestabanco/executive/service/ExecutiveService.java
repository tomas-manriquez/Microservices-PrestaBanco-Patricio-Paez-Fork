package com.prestabanco.executive.service;

import com.prestabanco.executive.entity.Executive;
import com.prestabanco.executive.repository.ExecutiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExecutiveService {

    @Autowired
    private ExecutiveRepository executiveRepository;

    public List<Executive> findAll() { return executiveRepository.findAll(); }

    public Executive findById(long id) { return executiveRepository.findById(id).get(); }

    public Executive save(Executive executive) { return executiveRepository.save(executive); }

    public boolean deleteById(long id) throws Exception {
        try{
            executiveRepository.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            throw new Exception("Error deleting executive", e);
        }
    }

    public long login(String email, String password) {
        Executive executive = executiveRepository.findByEmail(email);
        if (executive != null && password.equals(executive.getPassword())) {
            return executive.getIdExecutive();
        } else {
            return -1;
        }
    }
}
