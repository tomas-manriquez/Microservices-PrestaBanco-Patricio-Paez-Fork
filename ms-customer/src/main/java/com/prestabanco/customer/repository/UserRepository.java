package com.prestabanco.customer.repository;

import com.prestabanco.customer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findFirstByEmail(String email);
}
