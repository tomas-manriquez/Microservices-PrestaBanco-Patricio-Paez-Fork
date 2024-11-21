package com.prestabanco.request.controller;

import com.prestabanco.request.entity.Request;
import com.prestabanco.request.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/request")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @GetMapping("/")
    public ResponseEntity<List<Request>> list() {
        List<Request> requests = requestService.findAll();
        return ResponseEntity.ok(requests); }

    @GetMapping("/{id}")
    public ResponseEntity<Request> get(@PathVariable int id) {
        Request request = requestService.findById(id);
        return ResponseEntity.ok(request); }

    @PostMapping("/")
    public ResponseEntity<Request> save(@RequestBody Request request) {
        Request requestSaved = requestService.save(request);
        return ResponseEntity.ok(requestSaved); }

    @PutMapping("/")
    public ResponseEntity<Request> update(@RequestBody Request request) {
        Request requestNew = requestService.save(request);
        return ResponseEntity.ok(requestNew); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable int id) throws Exception {
        var isDeleted = requestService.deleteById(id);
        return ResponseEntity.noContent().build();}
    /*
    @PutMapping("/autocheck")
    public ResponseEntity<Request> autocheck(@RequestBody Request request) {
        Request requestNew = requestService.autoCheck(request);
        return ResponseEntity.ok(requestNew);
    }

     */
}