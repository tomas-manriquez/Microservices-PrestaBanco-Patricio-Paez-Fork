package com.prestabanco.request.service;

import com.prestabanco.request.entity.Request;
import com.prestabanco.request.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    //@Autowired
    //private RestTemplate restTemplate;

    private static final String CUSTOMER_SERVICE_URL = "http://postgres:5432/customer-request/";

    public List<Request> findAll() { return requestRepository.findAll(); }

    public Request findById(int id) { return requestRepository.findById(id).get(); }

    public Request save(Request request) { return requestRepository.save(request); }

    public boolean deleteById(int id) throws Exception {
        try{
            requestRepository.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            throw new Exception("Error deleting request", e);
        }
    }
    /*
    public Request autoCheck(Request request) {
        Customer customer = request.getCustomer();

        int trueCount = 0;
        if (customer.isMinCashOnAccount()) trueCount++;
        if (customer.isConsistentSaveHistory()) trueCount++;
        if (customer.isPeriodicDeposits()) trueCount++;
        if (customer.isRelationYearsAndBalance()) trueCount++;
        if (customer.isRecentWithdraws()) trueCount++;

        if (customer.getAge() > 68 || trueCount <= 2 || customer.isLatePayments()) {
            request.setStatus(1);
            return requestRepository.save(request);
        }

        if (trueCount >= 3) {
            request.setStatus(2);
        }
        if (trueCount == 5) {
            request.setStatus(3);
        }

        return requestRepository.save(request);
    }

     */
}