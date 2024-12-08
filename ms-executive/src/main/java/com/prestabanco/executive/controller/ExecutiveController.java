package com.prestabanco.executive.controller;

import com.prestabanco.executive.entity.Executive;
import com.prestabanco.executive.service.ExecutiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/executive")
@CrossOrigin("*")
public class ExecutiveController {

    @Autowired
    private ExecutiveService executiveService;

    @GetMapping("/")
    public ResponseEntity<List<Executive>> list() {
        List<Executive> executives = executiveService.findAll();
        return ResponseEntity.ok(executives); }

    @GetMapping("/{id}")
    public ResponseEntity<Executive> get(@PathVariable long id) {
        Executive executive = executiveService.findById(id);
        return ResponseEntity.ok(executive); }

    @PostMapping("/")
    public ResponseEntity<Executive> save(@RequestBody Executive executive) {
        Executive executiveNew = executiveService.save(executive);
        return ResponseEntity.ok(executiveNew); }

    @PutMapping("/")
    public ResponseEntity<Executive> update(@RequestBody Executive executive) {
        Executive executiveNew = executiveService.save(executive);
        return ResponseEntity.ok(executiveNew); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable long id) throws Exception {
        var isDeleted = executiveService.deleteById(id);
        return ResponseEntity.noContent().build();}

    @PostMapping("/login")
    public ResponseEntity<Long> login(@RequestBody Executive executive) {
        Long response = executiveService.login(executive.getEmail(), executive.getPassword());

        if (response == -1) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }
}