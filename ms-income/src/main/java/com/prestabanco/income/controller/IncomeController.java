package com.prestabanco.income.controller;

import com.prestabanco.income.entity.Income;
import com.prestabanco.income.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @GetMapping("/")
    public ResponseEntity<List<Income>> list() {
        List<Income> incomes = incomeService.findAll();
        return ResponseEntity.ok().body(incomes); }

    @GetMapping("/{id}")
    public ResponseEntity<Income> get(@PathVariable int id) {
        Income income = incomeService.findById(id);
        return ResponseEntity.ok(income); }

    @PostMapping("/")
    public ResponseEntity<Income> save(@RequestBody Income income) {
        Income incomeSaved = incomeService.save(income);
        return ResponseEntity.ok(incomeSaved); }

    @PutMapping("/")
    public ResponseEntity<Income> update(@RequestBody Income income) {
        Income incomeNew = incomeService.save(income);
        return ResponseEntity.ok(incomeNew); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable int id) throws Exception {
        var isDeleted = incomeService.deleteById(id);
        return ResponseEntity.noContent().build();}
}
