package com.prestabanco.customer.service;

import com.prestabanco.customer.entity.Customer;
import com.prestabanco.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> findAll() { return customerRepository.findAll(); }

    public Customer findById(int id) { return customerRepository.findById(id).get(); }

    public Customer save(Customer customer) { return customerRepository.save(customer); }

    public boolean deleteById(int id) throws Exception {
        try{
            customerRepository.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            throw new Exception("Error deleting customer", e);
        }
    }

    public long login(String email, String password) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer != null && password.equals(customer.getPassword())) {
            return customer.getIdCustomer();
        } else {
            return -1;
        }
    }

}
