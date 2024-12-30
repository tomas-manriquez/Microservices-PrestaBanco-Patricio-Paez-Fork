package com.prestabanco.request.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int status; // 1 Rejected 2 Evaluating by executive 3 Accepted 4 Eliminated by customer 5 Delivering loan 6 Delivered loan
    private Long idUser;
    private Long idLoan;
}
