package com.prestabanco.customer.controller;


import com.prestabanco.customer.dto.CustomerDTO;
import com.prestabanco.customer.entity.Customer;
import com.prestabanco.customer.repository.CustomerRepository;
import com.prestabanco.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/")
    public ResponseEntity<List<Customer>> list() {
        List<Customer> customers = customerService.findAll();
        return ResponseEntity.ok(customers); }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> get(@PathVariable int id) {
        Customer customer = customerService.findById(id);
        return ResponseEntity.ok(customer); }

    @PutMapping("/")
    public ResponseEntity<Customer> update(@RequestBody Customer customer) {
        Customer customerNew = customerService.save(customer);
        return ResponseEntity.ok(customerNew); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable int id) throws Exception {
        var isDeleted = customerService.deleteById(id);
        return ResponseEntity.noContent().build();}

    @PostMapping("/login")
    public ResponseEntity<Long> login(@RequestBody Customer customer) {
        Long response = customerService.login(customer.getEmail(), customer.getPassword());

        if (response == -1) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Customer> register(@RequestBody Customer customer) {
        Customer customerSaved = customerService.save(customer);
        return ResponseEntity.ok(customerSaved); }

    @GetMapping("/dto/{id}")
    public CustomerDTO getCustomerById(@PathVariable int id) {
        Customer customer = customerService.findById(id);
        return new CustomerDTO(
                customer.getIdCustomer(),
                customer.getName(),
                customer.getAge(),
                customer.isMinCashOnAccount(),
                customer.isConsistentSaveHistory(),
                customer.isPeriodicDeposits(),
                customer.isRelationYearsAndBalance(),
                customer.isRecentWithdraws(),
                customer.isLatePayments()
        );
    }


}
