package com.prestabanco.executive.repository;

import com.prestabanco.executive.entity.Executive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutiveRepository extends JpaRepository<Executive, Long> {
    Executive findByEmail(String email);
}
