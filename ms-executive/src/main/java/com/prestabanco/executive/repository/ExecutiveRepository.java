package com.prestabanco.executive.repository;

import com.prestabanco.executive.entity.Executive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExecutiveRepository extends JpaRepository<Executive, Long> {
    Optional<Executive> findByEmail(String email);
}
