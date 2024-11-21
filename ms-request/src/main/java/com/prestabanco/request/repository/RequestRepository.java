package com.prestabanco.request.repository;

import com.prestabanco.request.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Integer> {
    Request findByIdCustomer(int id);
    Request findByIdLoan(int id);
}
