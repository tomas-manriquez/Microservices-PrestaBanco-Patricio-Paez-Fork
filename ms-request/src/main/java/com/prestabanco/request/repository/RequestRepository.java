package com.prestabanco.request.repository;

import com.prestabanco.request.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Integer> {
    List<Request> findByIdLoanIn(List<Long> loanIds);
}
