package com.prestabanco.income.repository;

import com.prestabanco.income.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> {
    Income findByIdCustomer(int idCustomer);
}
