package com.prestabanco.debt.controller;

import com.prestabanco.debt.entity.Debt;
import com.prestabanco.debt.service.DebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debt")
public class DebtController {

    @Autowired
    private DebtService debtService;

    @GetMapping("/")
    public ResponseEntity<List<Debt>> list() {
        List<Debt> debts = debtService.findAll();
        return ResponseEntity.ok(debts);}

    @GetMapping("/{id}")
    public ResponseEntity<Debt> get(@PathVariable int id) {
        Debt debt = debtService.findById(id);
        return ResponseEntity.ok(debt); }

    @PostMapping("/")
    public ResponseEntity<Debt> save(@RequestBody Debt debt) {
        Debt debtSaved = debtService.save(debt);
        return ResponseEntity.ok(debtSaved); }

    @PutMapping("/")
    public ResponseEntity<Debt> update(@RequestBody Debt debt) {
        Debt debtNew = debtService.save(debt);
        return ResponseEntity.ok(debtNew); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable int id) throws Exception {
        var isDeleted = debtService.deleteById(id);
        return ResponseEntity.noContent().build();}
}
