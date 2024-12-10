package com.prestabanco.request.service;
import com.prestabanco.request.config.LoanFeignClient;
import com.prestabanco.request.entity.Request;
import com.prestabanco.request.models.Loan;
import com.prestabanco.request.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final LoanFeignClient loanFeignClient;

    public RequestService(RequestRepository requestRepository, LoanFeignClient loanFeignClient) {
        this.requestRepository = requestRepository;
        this.loanFeignClient = loanFeignClient;
    }

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
    public List<Map<String, Object>> getRequestsByUser(Long userId) {
        List<Loan> loans = loanFeignClient.getLoansByUser(userId);

        List<Long> loanIds = loans.stream().map(Loan::getIdLoan).collect(Collectors.toList());
        List<Request> requests = requestRepository.findByIdLoanIn(loanIds);

        return requests.stream().map(request -> {
            Loan loan = loans.stream()
                    .filter(l -> l.getIdLoan().equals(request.getIdLoan()))
                    .findFirst()
                    .orElse(null);

            Map<String, Object> map = new HashMap<>();
            map.put("request", request);
            map.put("loan", loan);
            return map;
        }).collect(Collectors.toList());
    }
}