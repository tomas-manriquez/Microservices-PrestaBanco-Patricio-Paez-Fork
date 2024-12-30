package com.prestabanco.request.service;
import com.prestabanco.request.config.LoanFeignClient;
import com.prestabanco.request.entity.Request;
import com.prestabanco.request.models.Loan;
import com.prestabanco.request.models.RequestUpdate;
import com.prestabanco.request.repository.RequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final LoanFeignClient loanFeignClient;
    private static final Logger logger = LoggerFactory.getLogger(RequestService.class);

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
        logger.info("Fetching loans for user ID: {}", userId);
        List<Loan> loans = loanFeignClient.getLoansByUser(userId);

        if (loans.isEmpty()) {
            logger.warn("No loans found for user ID: {}", userId);
            return List.of();
        }

        List<Long> loanIds = loans.stream()
                .map(Loan::getId)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        logger.info("Loan IDs: {}", loanIds);

        if (loanIds.isEmpty()) {
            logger.warn("No valid loan IDs found for user ID: {}", userId);
            return List.of();
        }

        List<Request> requests = requestRepository.findByIdLoanIn(loanIds);

        if (requests.isEmpty()) {
            logger.warn("No requests found for loan IDs: {}", loanIds);
            return List.of();
        }

        return requests.stream().map(request -> {
            Loan loan = loans.stream()
                    .filter(l -> l  .getId().equals(request.getIdLoan()))
                    .findFirst()
                    .orElse(null);

            Map<String, Object> map = new HashMap<>();
            map.put("request", request);
            map.put("loan", loan);
            return map;
        }).collect(Collectors.toList());
    }

    public Request update(RequestUpdate request) {
        Request requestNew = requestRepository.findById(request.getId()).get();
        requestNew.setStatus(request.getStatus());
        return requestRepository.save(requestNew);
    }
}